import { type User } from '@prisma/client'
import {
	deleteDesign,
	type IDesignDeletedResponse,
} from '#app/models/design/design.delete.server'
import { getDesign } from '#app/models/design/design.get.server'
import {
	type IDesign,
	type IDesignEntityId,
} from '#app/models/design/design.server'
import {
	connectPrevAndNextDesigns,
	updateDesignToHead,
	updateDesignToTail,
} from '#app/models/design/design.update.server'
import { type designTypeEnum } from '#app/schema/design'
import { type IUpdateSelectedDesignStrategy } from '#app/strategies/design/update-selected.strategy'
import { prisma } from '#app/utils/db.server'
import { updateSelectedDesignService } from './update-selected.service'

export const designDeleteService = async ({
	userId,
	id,
	targetEntityId,
	updateSelectedDesignStrategy,
}: {
	userId: User['id']
	id: IDesign['id']
	targetEntityId: IDesignEntityId
	updateSelectedDesignStrategy: IUpdateSelectedDesignStrategy
}): Promise<IDesignDeletedResponse> => {
	try {
		const deleteDesignPromises = []

		// Step 1: get the design
		const design = await fetchDesign({ id, userId })
		const { nextId, prevId, selected } = design
		const type = design.type as designTypeEnum

		// Step 2: get next and previous designs
		const { nextDesign, prevDesign } = await getAdjacentDesigns({
			userId,
			design,
		})

		// Step 3: delete the design
		const deleteDesignPromise = deleteDesign({ id })
		deleteDesignPromises.push(deleteDesignPromise)

		// Step 4: update next/prev designs if they exist
		const updateDesignNodesPromises = updateDesignNodes({
			nextId,
			nextDesign,
			prevId,
			prevDesign,
		})
		deleteDesignPromises.push(...updateDesignNodesPromises)

		// Step 5: run all delete promises
		await prisma.$transaction(deleteDesignPromises)

		// Step 6: update the selected design for its type, if necessary
		if (selected) {
			await updateSelectedDesignService({
				targetEntityId,
				type,
				strategy: updateSelectedDesignStrategy,
			})
		}

		return { success: true }
	} catch (error) {
		console.log('designDeleteService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}

const fetchDesign = async ({
	id,
	userId,
}: {
	id: IDesign['id']
	userId: User['id']
}) => {
	const design = await getDesign({
		where: { id, ownerId: userId },
	})

	if (!design) throw new Error(`Design not found: ${id}`)

	return design
}

const getAdjacentDesigns = async ({
	userId,
	design,
}: {
	userId: User['id']
	design: IDesign
}) => {
	const { nextId, prevId } = design

	const nextDesign = nextId
		? await fetchDesign({
				userId,
				id: nextId,
			})
		: null

	const prevDesign = prevId
		? await fetchDesign({
				userId,
				id: prevId,
			})
		: null

	return { nextDesign, prevDesign }
}

// maintain linked list integrity
const updateDesignNodes = ({
	nextId,
	nextDesign,
	prevId,
	prevDesign,
}: {
	nextId: string | null
	nextDesign: IDesign | null
	prevId: string | null
	prevDesign: IDesign | null
}) => {
	const updateDesignNodesPromises = []

	if (!prevId && nextId && nextDesign) {
		// If head, remove prevId from next design, becomes head
		const nextNodeToHeadPromise = updateDesignToHead({ id: nextId })
		updateDesignNodesPromises.push(nextNodeToHeadPromise)
	} else if (!nextId && prevId && prevDesign) {
		// If tail, remove nextId from prev design, becomes tail
		const prevNodeToTailPromise = updateDesignToTail({ id: prevId })
		updateDesignNodesPromises.push(prevNodeToTailPromise)
	} else if (prevId && nextId && prevDesign && nextDesign) {
		// If in middle, connect prev and next designs directly
		const connectNodesPromise = connectPrevAndNextDesigns({
			prevId,
			nextId,
		})

		updateDesignNodesPromises.push(...connectNodesPromise)
	}

	return updateDesignNodesPromises
}
