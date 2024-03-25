import { type User } from '@prisma/client'
import {
	type IDesign,
	findFirstDesign,
	updateDesignToHead,
	updateDesignToTail,
	connectPrevAndNextDesigns,
	deleteDesign,
} from '#app/models/design.server'
import { type ILayer } from '#app/models/layer.server'
import { type designTypeEnum } from '#app/schema/design'
import { prisma } from '#app/utils/db.server'
import { layerUpdateSelectedDesignService } from '../update-selected-design.service'

export const layerDesignDeleteService = async ({
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
		const deleteDesignPromises = []

		// Step 1: get the design
		const design = await getDesign({ id, userId })
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
			await layerUpdateSelectedDesignService({
				layerId,
				designId: updateSelectedDesignId,
				type,
			})
		}

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
	design,
}: {
	userId: User['id']
	design: IDesign
}) => {
	const { nextId, prevId } = design

	const nextDesign = nextId
		? await getDesign({
				userId,
				id: nextId,
		  })
		: null

	const prevDesign = prevId
		? await getDesign({
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
		const nextLayerToHeadPromise = updateDesignToHead({ id: nextId })
		updateDesignNodesPromises.push(nextLayerToHeadPromise)
	} else if (!nextId && prevId && prevDesign) {
		// If tail, remove nextId from prev design, becomes tail
		const prevLayerToTailPromise = updateDesignToTail({ id: prevId })
		updateDesignNodesPromises.push(prevLayerToTailPromise)
	} else if (prevId && nextId && prevDesign && nextDesign) {
		// If in middle, connect prev and next designs directly
		const connectLayersPromise = connectPrevAndNextDesigns({
			prevId,
			nextId,
		})

		updateDesignNodesPromises.push(...connectLayersPromise)
	}

	return updateDesignNodesPromises
}
