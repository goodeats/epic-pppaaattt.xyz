import { type User } from '@prisma/client'
import { type IDesignUpdatedResponse } from '#app/models/design/design.update.server'
import {
	type IDesign,
	findFirstDesign,
	updateDesignRemoveNodes,
	updateDesignNodes,
	type IDesignIdOrNull,
	type IDesignEntityId,
} from '#app/models/design.server'
import { type designTypeEnum } from '#app/schema/design'
import { type IUpdateSelectedDesignStrategy } from '#app/strategies/design/update-selected.strategy'
import { prisma } from '#app/utils/db.server'
import { updateSelectedDesignService } from './update-selected.service'

export const designMoveUpService = async ({
	userId,
	id,
	targetEntityId,
	updateSelectedDesignId,
	updateSelectedDesignStrategy,
}: {
	userId: User['id']
	id: IDesign['id']
	targetEntityId: IDesignEntityId
	updateSelectedDesignId?: IDesignIdOrNull
	updateSelectedDesignStrategy: IUpdateSelectedDesignStrategy
}): Promise<IDesignUpdatedResponse> => {
	try {
		const moveUpDesignPromises = []

		// Step 1: get the current design
		// make sure it is not already head
		const currentDesign = await getDesign({ id, userId })
		const { prevId, nextId } = currentDesign
		if (!prevId) throw new Error('Design is already head')
		const type = currentDesign.type as designTypeEnum

		// Step 2: get previous design
		const prevDesign = await getDesign({ id: prevId, userId })
		const prevPrevId = prevDesign.prevId

		// Step 3: get adjacent designs if they exist
		const { prevPrevDesign, nextDesign } = await getAdjacentDesigns({
			userId,
			prevPrevId,
			nextId,
		})

		// Step 4: remove nextId and prevId nodes from all designs to satisfy unique constraint when updating other designs
		const designPromiseArgs = {
			currentDesign,
			prevDesign,
			prevPrevDesign,
			nextDesign,
		}

		const removeNodesPromises = removeDesignNodes(designPromiseArgs)
		moveUpDesignPromises.push(...removeNodesPromises)

		// Step 5: update nextId and prevId nodes for current and previous designs
		// and ensure consistency for adjacent designs
		const updateNodesPromises = updateDesignNodesPromises(designPromiseArgs)
		moveUpDesignPromises.push(...updateNodesPromises)

		// Step 6: run all move up promises
		await prisma.$transaction(moveUpDesignPromises)

		// Step 7: update the layer selected design for its type, if necessary
		// reorder is more complicated than just going by the current design state
		// look for selectedDesignToUpdateOnMoveUp in design utils
		await updateSelectedDesignService({
			targetEntityId,
			designId: updateSelectedDesignId,
			type,
			strategy: updateSelectedDesignStrategy,
		})

		return { success: true }
	} catch (error) {
		console.log('designMoveUpService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
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
	prevPrevId,
	nextId,
}: {
	userId: User['id']
	prevPrevId: string | null
	nextId: string | null
}) => {
	const prevPrevDesign = prevPrevId
		? await getDesign({
				id: prevPrevId,
				userId,
		  })
		: null

	const nextDesign = nextId ? await getDesign({ id: nextId, userId }) : null

	return { prevPrevDesign, nextDesign }
}

const removeDesignNodes = ({
	currentDesign,
	prevDesign,
	prevPrevDesign,
	nextDesign,
}: {
	currentDesign: IDesign
	prevDesign: IDesign
	prevPrevDesign: IDesign | null | undefined
	nextDesign: IDesign | null | undefined
}) => {
	const removeDesignNodesPromises = [
		updateDesignRemoveNodes({
			id: currentDesign.id,
		}),
		updateDesignRemoveNodes({
			id: prevDesign.id,
		}),
	]

	if (prevPrevDesign) {
		removeDesignNodesPromises.push(
			updateDesignRemoveNodes({
				id: prevPrevDesign.id,
			}),
		)
	}

	if (nextDesign) {
		removeDesignNodesPromises.push(
			updateDesignRemoveNodes({
				id: nextDesign.id,
			}),
		)
	}

	return removeDesignNodesPromises
}

const updateDesignNodesPromises = ({
	currentDesign,
	prevDesign,
	prevPrevDesign,
	nextDesign,
}: {
	currentDesign: IDesign
	prevDesign: IDesign
	prevPrevDesign: IDesign | null | undefined
	nextDesign: IDesign | null | undefined
}) => {
	const updateDesignNodesPromises = []

	// swap nextId and prevId for current and previous designs
	const currentDesignNodesPromise = updateDesignNodes({
		id: currentDesign.id,
		prevId: prevDesign.prevId,
		nextId: prevDesign.id,
	})

	const prevDesignNodesPromise = updateDesignNodes({
		id: prevDesign.id,
		prevId: currentDesign.id,
		nextId: currentDesign.nextId,
	})

	updateDesignNodesPromises.push(
		currentDesignNodesPromise,
		prevDesignNodesPromise,
	)

	// ensure consistency for adjacent designs
	if (prevPrevDesign) {
		const prevPrevDesignNodesPromise = updateDesignNodes({
			id: prevPrevDesign.id,
			prevId: prevPrevDesign.prevId,
			nextId: currentDesign.id,
		})
		updateDesignNodesPromises.push(prevPrevDesignNodesPromise)
	}

	if (nextDesign) {
		const nextDesignNodesPromise = updateDesignNodes({
			id: nextDesign.id,
			prevId: currentDesign.prevId,
			nextId: nextDesign.nextId,
		})
		updateDesignNodesPromises.push(nextDesignNodesPromise)
	}

	return updateDesignNodesPromises
}
