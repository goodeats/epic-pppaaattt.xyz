import { type User } from '@prisma/client'
import {
	findFirstLayer,
	updateLayerRemoveNodes,
	type ILayer,
	updateLayerNodes,
} from '#app/models/layer.server'
import { type IArtboard, prisma } from '#app/utils/db.server'

export const artboardLayerMoveDownService = async ({
	userId,
	id,
	artboardId,
}: {
	userId: User['id']
	id: ILayer['id']
	artboardId: IArtboard['id']
}) => {
	try {
		const moveDownLayerPromises = []

		// Step 1: get the current layer
		// make sure it is not already tail
		const currentLayer = await getLayer({ id, userId })
		const { prevId, nextId } = currentLayer
		if (!nextId) throw new Error('Layer is already tail')

		// Step 2: get next layer
		const nextLayer = await getLayer({ id: nextId, userId })
		const nextNextId = nextLayer.nextId

		// Step 3: get adjacent layers if they exist
		const { nextNextLayer, prevLayer } = await getAdjacentLayers({
			userId,
			nextNextId,
			prevId,
		})

		// Step 4: remove nextId and prevId nodes from all layers
		// to satisfy unique constraint when updating other layers
		const laterPromiseArgs = {
			currentLayer,
			nextLayer,
			nextNextLayer,
			prevLayer,
		}

		const removeNodesPromises = removeLayerNodes(laterPromiseArgs)
		moveDownLayerPromises.push(...removeNodesPromises)

		// Step 5: update nextId and prevId nodes for current and next layers
		// and ensure consistency for adjacent layers
		const updateNodesPromises = updateLayerNodesPromises(laterPromiseArgs)
		moveDownLayerPromises.push(...updateNodesPromises)

		// Step 6: run all move down promises
		await prisma.$transaction(moveDownLayerPromises)

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
	id: ILayer['id']
	userId: User['id']
}) => {
	const layer = await findFirstLayer({
		where: { id, ownerId: userId },
	})

	if (!layer) throw new Error(`Layer not found: ${id}`)

	return layer
}

const getAdjacentLayers = async ({
	userId,
	nextNextId,
	prevId,
}: {
	userId: User['id']
	nextNextId: string | null
	prevId: string | null
}) => {
	const nextNextLayer = nextNextId
		? await getLayer({
				id: nextNextId,
				userId,
		  })
		: null

	const prevLayer = prevId ? await getLayer({ id: prevId, userId }) : null

	return { nextNextLayer, prevLayer }
}

const removeLayerNodes = ({
	currentLayer,
	nextLayer,
	nextNextLayer,
	prevLayer,
}: {
	currentLayer: ILayer
	nextLayer: ILayer
	nextNextLayer: ILayer | null | undefined
	prevLayer: ILayer | null | undefined
}) => {
	const removeNodesPromises = [
		updateLayerRemoveNodes({
			id: currentLayer.id,
		}),
		updateLayerRemoveNodes({
			id: nextLayer.id,
		}),
	]

	if (nextNextLayer) {
		removeNodesPromises.push(
			updateLayerRemoveNodes({
				id: nextNextLayer.id,
			}),
		)
	}

	if (prevLayer) {
		removeNodesPromises.push(
			updateLayerRemoveNodes({
				id: prevLayer.id,
			}),
		)
	}

	return removeNodesPromises
}

const updateLayerNodesPromises = ({
	currentLayer,
	nextLayer,
	nextNextLayer,
	prevLayer,
}: {
	currentLayer: ILayer
	nextLayer: ILayer
	nextNextLayer: ILayer | null | undefined
	prevLayer: ILayer | null | undefined
}) => {
	const updateNodesPromises = []

	// swap nextId and prevId for current and next nodes
	const currentNodesPromise = updateLayerNodes({
		id: currentLayer.id,
		prevId: nextLayer.id,
		nextId: nextLayer.nextId,
	})

	const nextNodesPromise = updateLayerNodes({
		id: nextLayer.id,
		prevId: currentLayer.prevId,
		nextId: currentLayer.id,
	})

	updateNodesPromises.push(currentNodesPromise, nextNodesPromise)

	// ensure consistency for adjacent nodes
	if (nextNextLayer) {
		const nextNextNodesPromise = updateLayerNodes({
			id: nextNextLayer.id,
			prevId: currentLayer.id,
			nextId: nextNextLayer.nextId,
		})
		updateNodesPromises.push(nextNextNodesPromise)
	}

	if (prevLayer) {
		const prevNodesPromise = updateLayerNodes({
			id: prevLayer.id,
			prevId: prevLayer.prevId,
			nextId: currentLayer.nextId,
		})
		updateNodesPromises.push(prevNodesPromise)
	}

	return updateNodesPromises
}
