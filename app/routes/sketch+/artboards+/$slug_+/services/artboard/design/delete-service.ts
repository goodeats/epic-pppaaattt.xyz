import { type Design, type Artboard } from '@prisma/client'
import { findArtboardTransactionPromise } from '#app/models/artboard.server'
import { findDesignTransactionPromise } from '#app/models/design.server'
import {
	ArtboardSelectedDesignsSchema,
	type ArtboardSelectedDesignsType,
} from '#app/schema/artboard'
import { type PrismaTransactionType, prisma } from '#app/utils/db.server'

export const artboardDesignDeleteService = async ({
	id,
	artboardId,
}: {
	id: string
	artboardId: string
}) => {
	try {
		await prisma.$transaction(async prisma => {
			// get design
			const design = await prisma.design.findFirst({
				where: { id },
			})
			if (!design) throw new Error('Design not found')
			const { nextId, prevId, type } = design

			// get next and previous designs
			const { nextDesign, prevDesign } = await fetchAdjacentDesigns({
				design,
				prisma,
			})

			const updateOperations = [
				// delete design first before updating next/prev designs
				// this is necessary to avoid foreign key unique constraint errors
				deleteDesignPromise({ id, prisma }),
				// update next/prev designs if they exist
				// this is necessary to maintain the linked list structure
				...designUpdateOperations({
					nextId,
					nextDesign,
					prevId,
					prevDesign,
					prisma,
				}),
			]

			// Fetch artboard for selected designs
			const fetchArtboardPromise = findArtboardTransactionPromise({
				id: artboardId,
				prisma,
			})

			// Execute fetch operations in parallel
			const [artboard] = await Promise.all([fetchArtboardPromise])

			if (!artboard) throw new Error('Artboard not found')

			// if design was selected, remove it or replace it with the next visible design or null
			const artboardSelectedDesignId = await findArtboardSelectedDesignByType({
				artboard,
				type,
			})
			if (artboardSelectedDesignId === id) {
				if (nextId) {
					// update selected design for artboard to next visible design
				} else {
					// remove selected design from artboard
				}
			}

			// Execute all update operations in parallel
			await Promise.all(updateOperations)
		})

		console.log('Design deleted successfully')

		return { success: true }
	} catch (error) {
		console.log(error)
		return { error: true }
	}
}

const fetchAdjacentDesigns = async ({
	design,
	prisma,
}: {
	design: Design
	prisma: PrismaTransactionType
}) => {
	const { nextId, prevId } = design

	const fetchNextDesignPromise = nextId
		? findDesignTransactionPromise({
				id: nextId,
				prisma,
		  })
		: Promise.resolve(null)

	const fetchPrevDesignPromise = prevId
		? findDesignTransactionPromise({
				id: prevId,
				prisma,
		  })
		: Promise.resolve(null)

	const [nextDesign, prevDesign] = await Promise.all([
		fetchNextDesignPromise,
		fetchPrevDesignPromise,
	])

	return { nextDesign, prevDesign }
}

// Delete design (this needs to happen before we can update the next/prev designs)
const deleteDesignPromise = ({
	id,
	prisma,
}: {
	id: string
	prisma: PrismaTransactionType
}) => {
	return prisma.design.delete({
		where: { id },
	})
}

const designUpdateOperations = ({
	nextId,
	nextDesign,
	prevId,
	prevDesign,
	prisma,
}: {
	nextId: string | null
	nextDesign: Design | null
	prevId: string | null
	prevDesign: Design | null
	prisma: PrismaTransactionType
}) => {
	const updateOperations = []

	if (!prevId && nextId && nextDesign) {
		// If head, remove prevId from next design, becomes head
		updateOperations.push(removePrevIdFromNextDesign({ nextId, prisma }))
	} else if (prevId && !nextId && prevDesign) {
		// If tail, remove nextId from prev design, becomes tail
		updateOperations.push(removeNextIdFromPrevDesign({ prevId, prisma }))
	} else if (prevId && nextId && prevDesign && nextDesign) {
		// If in middle, connect prev and next designs directly
		updateOperations.push(
			...connectPrevAndNextDesigns({ prevId, nextId, prisma }),
		)
	}

	return updateOperations
}

const removePrevIdFromNextDesign = ({
	nextId,
	prisma,
}: {
	nextId: string
	prisma: PrismaTransactionType
}) => {
	return prisma.design.update({
		where: { id: nextId },
		data: { prevId: null },
	})
}

const removeNextIdFromPrevDesign = ({
	prevId,
	prisma,
}: {
	prevId: string
	prisma: PrismaTransactionType
}) => {
	return prisma.design.update({
		where: { id: prevId },
		data: { nextId: null },
	})
}

const connectPrevAndNextDesigns = ({
	prevId,
	nextId,
	prisma,
}: {
	prevId: string
	nextId: string
	prisma: PrismaTransactionType
}) => {
	return [
		prisma.design.update({
			where: { id: prevId },
			data: { nextId },
		}),
		prisma.design.update({
			where: { id: nextId },
			data: { prevId },
		}),
	]
}

const findArtboardSelectedDesignByType = async ({
	artboard,
	type,
}: {
	artboard: Artboard
	type: string
}): Promise<string | undefined> => {
	const { selectedDesigns } = artboard
	const parsedSelectedDesigns = ArtboardSelectedDesignsSchema.parse(
		JSON.parse(selectedDesigns),
	) as ArtboardSelectedDesignsType

	const designKey = (type + 'Id') as keyof ArtboardSelectedDesignsType
	return parsedSelectedDesigns[designKey]
}
