import { type User } from '@prisma/client'
import {
	type IDesign,
	findFirstDesign,
	updateDesignRemoveNodes,
	updateDesignNodes,
} from '#app/models/design.server'
import { type ILayer } from '#app/models/layer.server'
import { type designTypeEnum } from '#app/schema/design'
import { prisma } from '#app/utils/db.server'
import { layerUpdateSelectedDesignService } from './update-selected.service'

export const layerDesignMoveDownService = async ({
	userId,
	id,
	layerId,
	updateSelectedDesignId,
}: {
	userId: User['id']
	id: IDesign['id']
	layerId: ILayer['id']
	updateSelectedDesignId?: string | null
}) => {
	try {
		const moveDownDesignPromises = []

		// Step 1: get the current design
		// make sure it is not already tail
		const currentDesign = await getDesign({ id, userId })
		const { prevId, nextId } = currentDesign
		if (!nextId) throw new Error('Design is already tail')
		const type = currentDesign.type as designTypeEnum

		// Step 2: get next design
		const nextDesign = await getDesign({ id: nextId, userId })
		const nextNextId = nextDesign.nextId

		// Step 3: get adjacent designs if they exist
		const { nextNextDesign, prevDesign } = await getAdjacentDesigns({
			userId,
			nextNextId,
			prevId,
		})

		// Step 4: remove nextId and prevId nodes from all designs to satisfy unique constraint when updating other designs
		const designPromiseArgs = {
			currentDesign,
			nextDesign,
			nextNextDesign,
			prevDesign,
		}

		const removeNodesPromises = removeDesignNodes(designPromiseArgs)
		moveDownDesignPromises.push(...removeNodesPromises)

		// Step 5: update nextId and prevId nodes for current and next designs
		// and ensure consistency for adjacent designs
		const updateNodesPromises = updateDesignNodesPromises(designPromiseArgs)
		moveDownDesignPromises.push(...updateNodesPromises)

		// Step 6: run all move down promises
		await prisma.$transaction(moveDownDesignPromises)

		// Step 7: update the layer selected design for its type, if necessary
		// reorder is more complicated than just going by the current design state
		// look for selectedDesignToUpdateOnMoveUp in design utils
		await layerUpdateSelectedDesignService({
			layerId,
			designId: updateSelectedDesignId,
			type,
		})

		return { success: true }
	} catch (error) {
		console.log(error)
		return { error: true }
	}
}

const getDesign = async ({
	id,
	userId,
}: {
	id: IDesign['id']
	userId: User['id']
}) => {
	const design = await findFirstDesign({
		where: { id, ownerId: userId },
	})

	if (!design) throw new Error(`Design not found: ${id}`)

	return design
}

const getAdjacentDesigns = async ({
	userId,
	nextNextId,
	prevId,
}: {
	userId: User['id']
	nextNextId: string | null
	prevId: string | null
}) => {
	const nextNextDesign = nextNextId
		? await getDesign({
				id: nextNextId,
				userId,
		  })
		: null

	const prevDesign = prevId ? await getDesign({ id: prevId, userId }) : null

	return { nextNextDesign, prevDesign }
}

const removeDesignNodes = ({
	currentDesign,
	nextDesign,
	nextNextDesign,
	prevDesign,
}: {
	currentDesign: IDesign
	nextDesign: IDesign
	nextNextDesign: IDesign | null | undefined
	prevDesign: IDesign | null | undefined
}) => {
	const removeDesignNodesPromises = [
		updateDesignRemoveNodes({
			id: currentDesign.id,
		}),
		updateDesignRemoveNodes({
			id: nextDesign.id,
		}),
	]

	if (nextNextDesign) {
		removeDesignNodesPromises.push(
			updateDesignRemoveNodes({
				id: nextNextDesign.id,
			}),
		)
	}

	if (prevDesign) {
		removeDesignNodesPromises.push(
			updateDesignRemoveNodes({
				id: prevDesign.id,
			}),
		)
	}

	return removeDesignNodesPromises
}

const updateDesignNodesPromises = ({
	currentDesign,
	nextDesign,
	nextNextDesign,
	prevDesign,
}: {
	currentDesign: IDesign
	nextDesign: IDesign
	nextNextDesign: IDesign | null | undefined
	prevDesign: IDesign | null | undefined
}) => {
	const updateDesignNodesPromises = []

	// swap nextId and prevId for current and next designs
	const currentDesignNodesPromise = updateDesignNodes({
		id: currentDesign.id,
		prevId: nextDesign.id,
		nextId: nextDesign.nextId,
	})

	const nextDesignNodesPromise = updateDesignNodes({
		id: nextDesign.id,
		prevId: currentDesign.prevId,
		nextId: currentDesign.id,
	})

	updateDesignNodesPromises.push(
		currentDesignNodesPromise,
		nextDesignNodesPromise,
	)

	// ensure consistency for adjacent designs
	if (nextNextDesign) {
		const nextNextDesignNodesPromise = updateDesignNodes({
			id: nextNextDesign.id,
			prevId: currentDesign.id,
			nextId: nextNextDesign.nextId,
		})
		updateDesignNodesPromises.push(nextNextDesignNodesPromise)
	}

	if (prevDesign) {
		const prevDesignNodesPromise = updateDesignNodes({
			id: prevDesign.id,
			prevId: prevDesign.prevId,
			nextId: currentDesign.nextId,
		})
		updateDesignNodesPromises.push(prevDesignNodesPromise)
	}

	return updateDesignNodesPromises
}
