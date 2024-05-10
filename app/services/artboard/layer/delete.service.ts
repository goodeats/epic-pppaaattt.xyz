import { type User, type Layer, type Artboard } from '@prisma/client'
import {
	findFirstLayer,
	connectPrevAndNextLayers,
	updateLayerToHead,
	updateLayerToTail,
} from '#app/models/layer/layer.server'
import { prisma } from '#app/utils/db.server'

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

		// Step 3: delete layer
		const deleteLayerPromise = deleteLayer({ id })

		// Step 4: update next/prev layers if they exist
		const updateLayerNodesPromises = updateLayerNodes({
			nextId,
			nextLayer,
			prevId,
			prevLayer,
		})

		await prisma.$transaction([deleteLayerPromise, ...updateLayerNodesPromises])

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

const deleteLayer = ({ id }: { id: Layer['id'] }) => {
	return prisma.layer.delete({
		where: { id },
	})
}

// maintain linked list integrity
const updateLayerNodes = ({
	nextId,
	nextLayer,
	prevId,
	prevLayer,
}: {
	nextId: string | null
	nextLayer: Layer | null
	prevId: string | null
	prevLayer: Layer | null
}) => {
	const updateLayerNodesPromises = []

	if (!prevId && nextId && nextLayer) {
		// If head, remove prevId from next layer, becomes head
		const nextLayerToHeadPromise = updateLayerToHead({ id: nextId })
		updateLayerNodesPromises.push(nextLayerToHeadPromise)
	} else if (!nextId && prevId && prevLayer) {
		// If tail, remove nextId from prev layer, becomes tail
		const prevLayerToTailPromise = updateLayerToTail({ id: prevId })
		updateLayerNodesPromises.push(prevLayerToTailPromise)
	} else if (prevId && nextId && prevLayer && nextLayer) {
		// If in middle, connect prev and next layers directly
		const connectLayersPromise = connectPrevAndNextLayers({
			prevId,
			nextId,
		})

		updateLayerNodesPromises.push(...connectLayersPromise)
	}

	return updateLayerNodesPromises
}
