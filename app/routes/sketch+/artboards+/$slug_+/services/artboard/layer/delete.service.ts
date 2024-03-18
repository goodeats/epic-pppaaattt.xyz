import { type Layer } from '@prisma/client'
import {
	connectPrevAndNextLayersPromise,
	findLayerTransactionPromise,
	getTransactionLayer,
} from '#app/models/layer.server'
import { type PrismaTransactionType, prisma } from '#app/utils/db.server'

export const artboardLayerDeleteService = async ({
	id,
	artboardId,
}: {
	id: string
	artboardId: string
}) => {
	try {
		await prisma.$transaction(async prisma => {
			// initialize promises array to run in parallel at the end
			const promises = []

			// Step 1: get the layer
			const layer = await getTransactionLayer({
				id,
				prisma,
			})
			const { nextId, prevId } = layer

			// Step 2: get next and previous layers
			const { nextLayer, prevLayer } = await fetchAdjacentLayers({
				layer,
				prisma,
			})

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

const fetchAdjacentLayers = async ({
	layer,
	prisma,
}: {
	layer: Layer
	prisma: PrismaTransactionType
}) => {
	const { nextId, prevId } = layer

	const fetchNextLayerPromise = nextId
		? findLayerTransactionPromise({
				id: nextId,
				prisma,
		  })
		: Promise.resolve(null)

	const fetchPrevLayerPromise = prevId
		? findLayerTransactionPromise({
				id: prevId,
				prisma,
		  })
		: Promise.resolve(null)

	const [nextLayer, prevLayer] = await Promise.all([
		fetchNextLayerPromise,
		fetchPrevLayerPromise,
	])

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
