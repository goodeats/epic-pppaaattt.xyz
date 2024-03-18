import { type User, type Layer, type Artboard } from '@prisma/client'
import {
	connectPrevAndNextLayersPromise,
	findFirstLayer,
} from '#app/models/layer.server'
import { type PrismaTransactionType, prisma } from '#app/utils/db.server'

export const artboardLayerDeleteService = async ({
	userId,
	id,
	artboardId,
}: {
	userId: User['id']
	id: Layer['id']
	artboardId: Artboard['id']
}) => {
	try {
		// Step 1: get the layer
		const layer = await getLayer({
			userId,
			id,
		})
		const { nextId, prevId } = layer

		// Step 2: get next and previous layers
		const { nextLayer, prevLayer } = await getAdjacentLayers({
			userId,
			layer,
		})

		await prisma.$transaction(async prisma => {
			// initialize promises array to run in parallel at the end
			const promises = []

			// Step 3: delete layer
			// this should be first to avoid foreign key unique constraint errors
			promises.push(
				deleteLayerPromise({
					id,
					prisma,
				}),
			)

			// Step 4: update next/prev layers if they exist
			const layersPromises = layerUpdatePromises({
				nextId,
				nextLayer,
				prevId,
				prevLayer,
				prisma,
			})
			promises.push(...layersPromises)

			// Final Step: Execute all update operations in parallel
			await Promise.all(promises)
		})

		return { success: true }
	} catch (error) {
		console.log(error)
		return { error: true }
	}
}

const getLayer = async ({
	id,
	userId,
}: {
	id: Layer['id']
	userId: User['id']
}) => {
	const layer = await findFirstLayer({
		where: { id, ownerId: userId },
	})

	if (!layer) throw new Error('Layer not found')

	return layer
}

const getAdjacentLayers = async ({
	userId,
	layer,
}: {
	userId: User['id']
	layer: Layer
}) => {
	const { nextId, prevId } = layer

	const nextLayer = nextId
		? await getLayer({
				userId,
				id: nextId,
		  })
		: null

	const prevLayer = prevId
		? await getLayer({
				userId,
				id: prevId,
		  })
		: null

	return { nextLayer, prevLayer }
}

// Delete layer (this needs to happen before we can update the next/prev layers)
const deleteLayerPromise = ({
	id,
	prisma,
}: {
	id: string
	prisma: PrismaTransactionType
}) => {
	return prisma.layer.delete({
		where: { id },
	})
}

// maintain linked list integrity
const layerUpdatePromises = ({
	nextId,
	nextLayer,
	prevId,
	prevLayer,
	prisma,
}: {
	nextId: string | null
	nextLayer: Layer | null
	prevId: string | null
	prevLayer: Layer | null
	prisma: PrismaTransactionType
}) => {
	const layersPromises = []

	if (!prevId && nextId && nextLayer) {
		// If head, remove prevId from next layer, becomes head
		layersPromises.push(removePrevIdFromNextLayer({ nextId, prisma }))
	} else if (prevId && !nextId && prevLayer) {
		// If tail, remove nextId from prev layer, becomes tail
		layersPromises.push(removeNextIdFromPrevLayer({ prevId, prisma }))
	} else if (prevId && nextId && prevLayer && nextLayer) {
		// If in middle, connect prev and next layers directly
		layersPromises.push(
			...connectPrevAndNextLayersPromise({ prevId, nextId, prisma }),
		)
	}

	return layersPromises
}

const removePrevIdFromNextLayer = ({
	nextId,
	prisma,
}: {
	nextId: string
	prisma: PrismaTransactionType
}) => {
	return prisma.layer.update({
		where: { id: nextId },
		data: { prevId: null },
	})
}

const removeNextIdFromPrevLayer = ({
	prevId,
	prisma,
}: {
	prevId: string
	prisma: PrismaTransactionType
}) => {
	return prisma.layer.update({
		where: { id: prevId },
		data: { nextId: null },
	})
}
