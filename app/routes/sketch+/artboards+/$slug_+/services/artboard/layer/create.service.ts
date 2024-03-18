import { type User, type Artboard } from '@prisma/client'
import { connectPrevAndNextLayersPromise } from '#app/models/layer.server'
import { LayerDataCreateSchema } from '#app/schema/layer'
import { type PrismaTransactionType, prisma } from '#app/utils/db.server'
import { artboardLayerCopyDesignsFromArtboardService } from './copy-designs-from-artboard.service'

type artboardLayerCreateServiceProps = {
	userId: User['id']
	artboardId: Artboard['id']
}

export const artboardLayerCreateService = async ({
	userId,
	artboardId,
}: artboardLayerCreateServiceProps) => {
	// initialize variable for created layer id
	let createdLayerId: string | null = null

	try {
		await prisma.$transaction(async prisma => {
			// initialize promises array to run in parallel at the end
			const promises = []

			// Step 1: find existing artboard layers tail
			const tailLayer = await fetchArtboardLayersTail({
				artboardId,
				prisma,
			})

			// Step 2: create new layer
			const newLayer = await createLayerPromise({
				userId,
				artboardId,
				prisma,
			})
			promises.push(newLayer)

			// Step 3: connect new layer to tail layer if it exists
			if (tailLayer) {
				promises.push(
					...connectPrevAndNextLayersPromise({
						prevId: tailLayer.id,
						nextId: newLayer.id,
						prisma,
					}),
				)
			}

			// Step 4: create new layer
			const [createdLayer] = await Promise.all(promises)
			console.log('createdLayer', createdLayer)
			createdLayerId = createdLayer.id

			// After layer is created

			// Final Step: copy new layer designs from artboard
			// await artboardLayerCopyDesignsFromArtboardService({
			// 	userId,
			// 	artboardId,
			// 	layerId: createdLayer.id,
			// })
		})

		if (!createdLayerId) throw new Error('Layer was not created')
		console.log('createdLayerId', createdLayerId)

		await artboardLayerCopyDesignsFromArtboardService({
			userId,
			artboardId,
			layerId: createdLayerId,
		})

		return { success: true }
	} catch (error) {
		console.log(error)
		return { error: true }
	}
}

const fetchArtboardLayersTail = async ({
	artboardId,
	prisma,
}: {
	artboardId: Artboard['id']
	prisma: PrismaTransactionType
}) => {
	return await prisma.layer.findFirst({
		where: { artboardId, nextId: null },
	})
}

const createLayerPromise = async ({
	userId,
	artboardId,
	prisma,
}: {
	userId: User['id']
	artboardId: Artboard['id']
	prisma: PrismaTransactionType
}) => {
	const artboardLayerCount = await prisma.layer.count({
		where: { artboardId },
	})
	const name = `Layer ${artboardLayerCount + 1}`
	const data = LayerDataCreateSchema.parse({
		name,
		ownerId: userId,
		artboardId,
	})
	return prisma.layer.create({ data })
}
