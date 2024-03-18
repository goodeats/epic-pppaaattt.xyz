import { type User, type Artboard } from '@prisma/client'
import {
	connectPrevAndNextLayers,
	findFirstLayer,
} from '#app/models/layer.server'
import { LayerDataCreateSchema } from '#app/schema/layer'
import { prisma } from '#app/utils/db.server'
import { artboardLayerCopyDesignsFromArtboardService } from './copy-designs-from-artboard.service'

type artboardLayerCreateServiceProps = {
	userId: User['id']
	artboardId: Artboard['id']
}

export const artboardLayerCreateService = async ({
	userId,
	artboardId,
}: artboardLayerCreateServiceProps) => {
	try {
		// Step 1: find existing artboard layers tail
		const tailLayer = await fetchArtboardLayersTail({
			artboardId,
		})

		// Step 2: create new layer
		const createdLayer = await createLayer({
			userId,
			artboardId,
		})

		// Step 3: connect new layer to tail layer if it exists
		if (tailLayer) {
			await connectPrevAndNextLayers({
				prevId: tailLayer.id,
				nextId: createdLayer.id,
			})
		}

		// Step 4: copy designs from artboard to created layer
		await artboardLayerCopyDesignsFromArtboardService({
			userId,
			artboardId,
			layerId: createdLayer.id,
		})

		return { success: true }
	} catch (error) {
		console.log(error)
		return { error: true }
	}
}

const fetchArtboardLayersTail = async ({
	artboardId,
}: {
	artboardId: Artboard['id']
}) => {
	return await findFirstLayer({
		where: { artboardId, nextId: null },
	})
}

const createLayer = async ({
	userId,
	artboardId,
}: {
	userId: User['id']
	artboardId: Artboard['id']
}) => {
	const name = createLayerName({ artboardId })
	const data = LayerDataCreateSchema.parse({
		name,
		ownerId: userId,
		artboardId,
	})
	const createdLayer = await prisma.layer.create({ data })

	if (!createdLayer) throw new Error('Layer was not created')

	return createdLayer
}

const createLayerName = async ({
	artboardId,
}: {
	artboardId: Artboard['id']
}) => {
	const artboardLayerCount = await prisma.layer.count({
		where: { artboardId },
	})
	return `Layer ${artboardLayerCount + 1}`
}
