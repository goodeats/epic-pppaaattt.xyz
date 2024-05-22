import { type IArtworkVersion } from '#app/models/artwork-version/artwork-version.server'
import {
	findFirstLayer,
	updateLayerRemoveNodes,
	type ILayer,
	updateLayerNodes,
} from '#app/models/layer/layer.server'
import { type IUser } from '#app/models/user/user.server'
import { prisma } from '#app/utils/db.server'

export const artworkVersionLayerMoveUpService = async ({
	userId,
	id,
	artworkVersionId,
}: {
	userId: IUser['id']
	id: ILayer['id']
	artworkVersionId: IArtworkVersion['id']
}) => {
	try {
		const moveUpLayerPromises = []

		// Step 1: get the current layer
		// make sure it is not already head
		const currentLayer = await getLayer({ id, userId })
		const { prevId, nextId } = currentLayer
		if (!prevId) throw new Error('Layer is already head')

		// Step 2: get previous layer
		const prevLayer = await getLayer({ id: prevId, userId })
		const prevPrevId = prevLayer.prevId

		// Step 3: get adjacent layers if they exist
		const { prevPrevLayer, nextLayer } = await getAdjacentLayers({
			userId,
			prevPrevId,
			nextId,
		})

		// Step 4: remove nextId and prevId nodes from all layers
		// to satisfy unique constraint when updating other layers
		const layerPromiseArgs = {
			currentLayer,
			prevLayer,
			prevPrevLayer,
			nextLayer,
		}

		const removeNodesPromises = removeLayerNodes(layerPromiseArgs)
		moveUpLayerPromises.push(...removeNodesPromises)

		// Step 5: update nextId and prevId nodes for current and previous layers
		// and ensure consistency for adjacent layers
		const updateNodesPromises = updateLayerNodesPromises(layerPromiseArgs)
		moveUpLayerPromises.push(...updateNodesPromises)

		// Step 6: run all move up promises
		await prisma.$transaction(moveUpLayerPromises)

		return { success: true }
	} catch (error) {
		console.log('artworkVersionLayerMoveUpService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}

const getLayer = async ({
	id,
	userId,
}: {
	id: ILayer['id']
	userId: IUser['id']
}) => {
	const layer = await findFirstLayer({
		where: { id, ownerId: userId },
	})

	if (!layer) throw new Error(`Layer not found: ${id}`)

	return layer
}

const getAdjacentLayers = async ({
	userId,
	prevPrevId,
	nextId,
}: {
	userId: IUser['id']
	prevPrevId: string | null
	nextId: string | null
}) => {
	const prevPrevLayer = prevPrevId
		? await getLayer({
				id: prevPrevId,
				userId,
		  })
		: null

	const nextLayer = nextId ? await getLayer({ id: nextId, userId }) : null

	return { prevPrevLayer, nextLayer }
}

const removeLayerNodes = ({
	currentLayer,
	prevLayer,
	prevPrevLayer,
	nextLayer,
}: {
	currentLayer: ILayer
	prevLayer: ILayer
	prevPrevLayer: ILayer | null | undefined
	nextLayer: ILayer | null | undefined
}) => {
	const removeNodesPromises = [
		updateLayerRemoveNodes({
			id: currentLayer.id,
		}),
		updateLayerRemoveNodes({
			id: prevLayer.id,
		}),
	]

	if (prevPrevLayer) {
		removeNodesPromises.push(
			updateLayerRemoveNodes({
				id: prevPrevLayer.id,
			}),
		)
	}

	if (nextLayer) {
		removeNodesPromises.push(
			updateLayerRemoveNodes({
				id: nextLayer.id,
			}),
		)
	}

	return removeNodesPromises
}

const updateLayerNodesPromises = ({
	currentLayer,
	prevLayer,
	prevPrevLayer,
	nextLayer,
}: {
	currentLayer: ILayer
	prevLayer: ILayer
	prevPrevLayer: ILayer | null | undefined
	nextLayer: ILayer | null | undefined
}) => {
	const updateNodesPromises = []

	// swap nextId and prevId for current and previous nodes
	const currentNodesPromise = updateLayerNodes({
		id: currentLayer.id,
		prevId: prevLayer.prevId,
		nextId: prevLayer.id,
	})

	const prevNodesPromise = updateLayerNodes({
		id: prevLayer.id,
		prevId: currentLayer.id,
		nextId: currentLayer.nextId,
	})

	updateNodesPromises.push(currentNodesPromise, prevNodesPromise)

	// ensure consistency for adjacent nodes
	if (prevPrevLayer) {
		const prevPrevNodesPromise = updateLayerNodes({
			id: prevPrevLayer.id,
			prevId: prevPrevLayer.prevId,
			nextId: currentLayer.id,
		})
		updateNodesPromises.push(prevPrevNodesPromise)
	}

	if (nextLayer) {
		const nextNodesPromise = updateLayerNodes({
			id: nextLayer.id,
			prevId: currentLayer.prevId,
			nextId: nextLayer.nextId,
		})
		updateNodesPromises.push(nextNodesPromise)
	}

	return updateNodesPromises
}
