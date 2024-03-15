import { type Artboard, type Design } from '@prisma/client'
import {
	getTransactionArtboard,
	removeArtboardSelectedDesignPromise,
	updateArtboardSelectedDesignPromise,
} from '#app/models/artboard.server'
import { getTransactionDesign } from '#app/models/design.server'
import { type designTypeEnum } from '#app/schema/design'
import { type PrismaTransactionType, prisma } from '#app/utils/db.server'

export const artboardDesignMoveDownService = async ({
	id,
	artboardId,
	updateSelectedDesignId,
}: {
	id: string
	artboardId: string
	updateSelectedDesignId: string | null
}) => {
	try {
		await prisma.$transaction(async prisma => {
			// initialize promises array to run in parallel at the end
			const promises = []

			// Step 1: get current design
			const currentDesign = await getTransactionDesign({ id, prisma })
			const { prevId, nextId } = currentDesign
			const type = currentDesign.type as designTypeEnum
			if (!nextId) throw new Error('Design is already tail')

			// Step 2: get next design
			const nextDesign = await getTransactionDesign({ id: nextId, prisma })
			const nextNextId = nextDesign.nextId

			// Step 3: get adjacent designs if they exist
			const { nextNextDesign, prevDesign } = await getAdjacentDesigns({
				nextNextId,
				prevId,
				prisma,
			})

			// Step 4: remove nextId and prevId nodes from all designs to satisfy unique constraint when updating other designs
			const designPromiseArgs = {
				currentDesign,
				nextDesign,
				nextNextDesign,
				prevDesign,
				prisma,
			}

			const removeNodesPromises = removeDesignNodesPromises(designPromiseArgs)
			promises.push(...removeNodesPromises)

			// Step 5: update nextId and prevId nodes for current and previous designs
			// and ensure consistency for adjacent designs
			const updateNodesPromises = updateDesignNodesPromises(designPromiseArgs)
			promises.push(...updateNodesPromises)

			// Step 6: update selected design for artboard
			// for the current design type
			// either replace or remove
			const artboard = await getTransactionArtboard({ id: artboardId, prisma })
			if (updateSelectedDesignId) {
				const updateSelectedDesignPromise =
					await findAndUpdateArtboardSelectedDesignPromise({
						artboard,
						updateSelectedDesignId,
						type,
						prisma,
					})
				promises.push(updateSelectedDesignPromise)
			} else {
				const removeSelectedDesignPromise = removeArtboardSelectedDesignPromise(
					{
						artboard,
						type,
						prisma,
					},
				)
				promises.push(removeSelectedDesignPromise)
			}

			// Final Step: Execute all update operations in parallel
			await Promise.all(promises)
		})

		return { success: true }
	} catch (error) {
		console.log(error)
		return { error: true }
	}
}

const getAdjacentDesigns = async ({
	nextNextId,
	prevId,
	prisma,
}: {
	nextNextId: string | null
	prevId: string | null
	prisma: PrismaTransactionType
}) => {
	const nextNextDesign = nextNextId
		? await getTransactionDesign({
				id: nextNextId,
				prisma,
		  })
		: null

	const prevDesign = prevId
		? await getTransactionDesign({ id: prevId, prisma })
		: null

	return { nextNextDesign, prevDesign }
}

const removeDesignNodesPromise = ({
	id,
	prisma,
}: {
	id: string
	prisma: PrismaTransactionType
}) => {
	return prisma.design.update({
		where: { id },
		data: { prevId: null, nextId: null },
	})
}

const updateDesignNodesPromise = ({
	id,
	nextId,
	prevId,
	prisma,
}: {
	id: string
	nextId: string | null
	prevId: string | null
	prisma: PrismaTransactionType
}) => {
	return prisma.design.update({
		where: { id },
		data: { prevId, nextId },
	})
}

const removeDesignNodesPromises = ({
	currentDesign,
	nextDesign,
	nextNextDesign,
	prevDesign,
	prisma,
}: {
	currentDesign: Design
	nextDesign: Design
	nextNextDesign: Design | null | undefined
	prevDesign: Design | null | undefined
	prisma: PrismaTransactionType
}) => {
	const removeDesignNodesPromises = [
		removeDesignNodesPromise({
			id: currentDesign.id,
			prisma,
		}),
		removeDesignNodesPromise({
			id: nextDesign.id,
			prisma,
		}),
	]

	if (nextNextDesign) {
		removeDesignNodesPromises.push(
			removeDesignNodesPromise({
				id: nextNextDesign.id,
				prisma,
			}),
		)
	}

	if (prevDesign) {
		removeDesignNodesPromises.push(
			removeDesignNodesPromise({
				id: prevDesign.id,
				prisma,
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
	prisma,
}: {
	currentDesign: Design
	nextDesign: Design
	nextNextDesign: Design | null | undefined
	prevDesign: Design | null | undefined
	prisma: PrismaTransactionType
}) => {
	const updateDesignNodesPromises = []

	// swap nextId and prevId for current and next designs
	const currentDesignNodesPromise = updateDesignNodesPromise({
		id: currentDesign.id,
		prevId: nextDesign.id,
		nextId: nextDesign.nextId,
		prisma,
	})

	const nextDesignNodesPromise = updateDesignNodesPromise({
		id: nextDesign.id,
		prevId: currentDesign.prevId,
		nextId: currentDesign.id,
		prisma,
	})

	updateDesignNodesPromises.push(
		currentDesignNodesPromise,
		nextDesignNodesPromise,
	)

	// ensure consistency for adjacent designs
	if (nextNextDesign) {
		const nextNextDesignNodesPromise = updateDesignNodesPromise({
			id: nextNextDesign.id,
			prevId: currentDesign.id,
			nextId: nextNextDesign.nextId,
			prisma,
		})
		updateDesignNodesPromises.push(nextNextDesignNodesPromise)
	}

	if (prevDesign) {
		const prevDesignNodesPromise = updateDesignNodesPromise({
			id: prevDesign.id,
			prevId: prevDesign.prevId,
			nextId: currentDesign.nextId,
			prisma,
		})
		updateDesignNodesPromises.push(prevDesignNodesPromise)
	}

	return updateDesignNodesPromises
}

const findAndUpdateArtboardSelectedDesignPromise = async ({
	artboard,
	updateSelectedDesignId,
	type,
	prisma,
}: {
	artboard: Artboard
	updateSelectedDesignId: string
	type: designTypeEnum
	prisma: PrismaTransactionType
}) => {
	// find the new selected design, make sure it exists
	const newSelectedDesign = await getTransactionDesign({
		id: updateSelectedDesignId,
		prisma,
	})
	const updateSelectedDesignPromise = updateArtboardSelectedDesignPromise({
		artboard,
		designId: newSelectedDesign.id,
		type,
		prisma,
	})
	return updateSelectedDesignPromise
}
