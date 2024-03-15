import { type Design } from '@prisma/client'
import { type PrismaTransactionType, prisma } from '#app/utils/db.server'

export const artboardDesignMoveUpService = async ({
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
			// Step 1: get current design
			const currentDesign = await getDesign({ id, prisma })
			const { prevId, nextId } = currentDesign
			if (!prevId) throw new Error('Design is already head')

			// Step 2: get previous design
			const prevDesign = await getDesign({ id: prevId, prisma })
			const prevPrevId = prevDesign.prevId

			// Step 3: get adjacent designs if they exist
			const { prevPrevDesign, nextDesign } = await getAdjacentDesigns({
				prevPrevId,
				nextId,
				prisma,
			})

			// Step 4: remove nextId and prevId nodes from all designs to satisfy unique constraint when updating other designs
			const removeNodesPromises = removeDesignNodesPromises({
				currentDesign,
				prevDesign,
				prevPrevDesign,
				nextDesign,
				prisma,
			})

			// Step 5: update nextId and prevId nodes for current and previous designs
			// and ensure consistency for adjacent designs
			const updateNodesPromises = updateDesignNodesPromises({
				currentDesign,
				prevDesign,
				prevPrevDesign,
				nextDesign,
				prisma,
			})

			// Execute all update operations in parallel
			await Promise.all([...removeNodesPromises, ...updateNodesPromises])
		})

		return { success: true }
	} catch (error) {
		console.log(error)
		return { error: true }
	}
}

const getDesign = async ({
	id,
	prisma,
}: {
	id: string
	prisma: PrismaTransactionType
}) => {
	const design = await prisma.design.findFirst({
		where: { id },
		include: { palette: true },
	})
	if (!design) throw new Error('Design not found')

	return design
}

const getAdjacentDesigns = async ({
	prevPrevId,
	nextId,
	prisma,
}: {
	prevPrevId: string | null
	nextId: string | null
	prisma: PrismaTransactionType
}) => {
	const prevPrevDesign = prevPrevId
		? await getDesign({
				id: prevPrevId,
				prisma,
		  })
		: null

	const nextDesign = nextId ? await getDesign({ id: nextId, prisma }) : null

	return { prevPrevDesign, nextDesign }
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
	prevDesign,
	prevPrevDesign,
	nextDesign,
	prisma,
}: {
	currentDesign: Design
	prevDesign: Design
	prevPrevDesign: Design | null | undefined
	nextDesign: Design | null | undefined
	prisma: PrismaTransactionType
}) => {
	const removeDesignNodesPromises = [
		removeDesignNodesPromise({
			id: currentDesign.id,
			prisma,
		}),
		removeDesignNodesPromise({
			id: prevDesign.id,
			prisma,
		}),
	]

	if (prevPrevDesign) {
		removeDesignNodesPromises.push(
			removeDesignNodesPromise({
				id: prevPrevDesign.id,
				prisma,
			}),
		)
	}

	if (nextDesign) {
		removeDesignNodesPromises.push(
			removeDesignNodesPromise({
				id: nextDesign.id,
				prisma,
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
	prisma,
}: {
	currentDesign: Design
	prevDesign: Design
	prevPrevDesign: Design | null | undefined
	nextDesign: Design | null | undefined
	prisma: PrismaTransactionType
}) => {
	const updateDesignNodesPromises = []

	// swap nextId and prevId for current and previous designs
	const currentDesignNodesPromise = updateDesignNodesPromise({
		id: currentDesign.id,
		prevId: prevDesign.prevId,
		nextId: prevDesign.id,
		prisma,
	})

	const prevDesignNodesPromise = updateDesignNodesPromise({
		id: prevDesign.id,
		prevId: currentDesign.id,
		nextId: currentDesign.nextId,
		prisma,
	})

	updateDesignNodesPromises.push(
		currentDesignNodesPromise,
		prevDesignNodesPromise,
	)

	// ensure consistency for adjacent designs
	if (prevPrevDesign) {
		const prevPrevDesignNodesPromise = updateDesignNodesPromise({
			id: prevPrevDesign.id,
			prevId: prevPrevDesign.prevId,
			nextId: currentDesign.id,
			prisma,
		})
		updateDesignNodesPromises.push(prevPrevDesignNodesPromise)
	}

	if (nextDesign) {
		const nextDesignNodesPromise = updateDesignNodesPromise({
			id: nextDesign.id,
			prevId: currentDesign.prevId,
			nextId: nextDesign.nextId,
			prisma,
		})
		updateDesignNodesPromises.push(nextDesignNodesPromise)
	}

	return updateDesignNodesPromises
}
