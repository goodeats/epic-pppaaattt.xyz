import { type User, type Artboard } from '@prisma/client'
import {
	connectPrevAndNextLayers,
	findFirstLayer,
} from '#app/models/layer.server'
import { ArtboardLayerDataCreateSchema } from '#app/schema/layer-artboard'
import { prisma } from '#app/utils/db.server'
import { layerCloneDesignsService } from './clone-designs.service'

export const artboardLayerCreateService = async ({
	userId,
	artboardId,
}: {
	userId: User['id']
	artboardId: Artboard['id']
}) => {
	try {
		// Step 1: find existing artboard layers tail
		const tailLayer = await getArtboardLayersTail({
			artboardId,
		})

		// Step 2: create new layer
		const createdLayer = await createLayer({
			userId,
			artboardId,
		})

		// Step 3: connect new layer to tail layer if it exists
		if (tailLayer) {
			const connectLayersPromise = connectPrevAndNextLayers({
				prevId: tailLayer.id,
				nextId: createdLayer.id,
			})
			await prisma.$transaction(connectLayersPromise)
		}

		// Step 4: copy designs from artboard to created layer
		await layerCloneDesignsService({
			userId,
			sourceEntityId: artboardId,
			targetEntityId: createdLayer.id,
		})

		return { success: true }
	} catch (error) {
		console.log('artboardLayerCreateService error', error)
		return { error: true }
	}
}

const getArtboardLayersTail = async ({
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
	const name = await createLayerName({ artboardId })
	const data = ArtboardLayerDataCreateSchema.parse({
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
