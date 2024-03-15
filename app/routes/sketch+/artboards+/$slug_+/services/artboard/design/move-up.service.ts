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
	console.log('artboardDesignMoveUpService')
	try {
		await prisma.$transaction(async prisma => {
			const updateNullOperations = []
			const updateOperations = []

			// Step 1: get current design
			const currentDesign = await getDesign({ id, prisma })
			if (!currentDesign) throw new Error('Design not found')

			const { prevId, nextId } = currentDesign

			// Step 2: get previous design
			if (!prevId) throw new Error('Design is already head')

			const prevDesign = await getDesign({ id: prevId, prisma })
			if (!prevDesign) throw new Error('Prev Design not found')

			// Step 3: get adjacent designs if they exist
			let prevPrevDesign, nextDesign
			if (prevDesign.prevId) {
				prevPrevDesign = await getDesign({
					id: prevDesign.prevId,
					prisma,
				})
			}

			if (nextId) {
				nextDesign = await getDesign({ id: nextId, prisma })
			}

			// Step 4: remove nextId and prevId from all designs to satisfy unique constraint when updating other designs
			// might be a workaround with prisma, but can manage this way for now
			const currentDesignRemoveNodesPromise = removeDesignNodesPromise({
				id,
				prisma,
			})
			const prevDesignRemoveNodesPromise = removeDesignNodesPromise({
				id: prevDesign.id,
				prisma,
			})
			updateNullOperations.push(
				currentDesignRemoveNodesPromise,
				prevDesignRemoveNodesPromise,
			)

			if (prevPrevDesign) {
				const prevPrevDesignRemoveNodesPromise = removeDesignNodesPromise({
					id: prevPrevDesign.id,
					prisma,
				})
				updateNullOperations.push(prevPrevDesignRemoveNodesPromise)
			}

			if (nextDesign) {
				const nextDesignRemoveNodesPromise = removeDesignNodesPromise({
					id: nextDesign.id,
					prisma,
				})
				updateNullOperations.push(nextDesignRemoveNodesPromise)
			}

			// Step 5: swap nextId and prevId for current and previous designs
			const currentDesignNodesPromise = updateDesignNodesPromise({
				id,
				prevId: prevDesign.prevId,
				nextId: prevDesign.id,
				prisma,
			})
			const prevDesignNodesPromise = updateDesignNodesPromise({
				id: prevDesign.id,
				prevId: id,
				nextId: currentDesign.nextId,
				prisma,
			})
			updateOperations.push(currentDesignNodesPromise, prevDesignNodesPromise)

			// Step 6: ensure consistency for adjacent designs
			if (prevPrevDesign) {
				const prevPrevDesignNodesPromise = updateDesignNodesPromise({
					id: prevPrevDesign.id,
					prevId: prevPrevDesign.prevId,
					nextId: id,
					prisma,
				})
				updateOperations.push(prevPrevDesignNodesPromise)
			}

			if (nextDesign) {
				const nextDesignNodesPromise = updateDesignNodesPromise({
					id: nextDesign.id,
					prevId,
					nextId: nextDesign.nextId,
					prisma,
				})
				updateOperations.push(nextDesignNodesPromise)
			}

			// Execute all update operations in parallel
			await Promise.all(updateNullOperations)
			await Promise.all(updateOperations)
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
	return await prisma.design.findFirst({
		where: { id },
		include: { palette: true },
	})
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
