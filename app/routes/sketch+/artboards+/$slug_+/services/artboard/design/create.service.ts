import { type Design, type Artboard } from '@prisma/client'
import { type User } from '@sentry/remix'
import {
	findArtboardTransactionPromise,
	updateArtboardSelectedDesignPromise,
} from '#app/models/artboard.server'
import { connectPrevAndNextDesignsPromise } from '#app/models/design.server'
import { designSchema, type designTypeEnum } from '#app/schema/design'
import { type PrismaTransactionType, prisma } from '#app/utils/db.server'

type artboardDesignCreateServiceProps = {
	userId: User['id']
	artboardId: Artboard['id']
	type: designTypeEnum
	visibleDesignsCount: number
}

export const artboardDesignCreateService = async ({
	userId,
	artboardId,
	type,
	visibleDesignsCount,
}: artboardDesignCreateServiceProps) => {
	try {
		await prisma.$transaction(async prisma => {
			// new designs are appended to the end of the list
			// find the last design in the list (tail) by type
			const previousDesign = await fetchArtboardDesignTypeTail({
				artboardId,
				type,
				prisma,
			})

			// create design before its associated type
			const design = await createDesign({
				userId,
				artboardId,
				type,
				prisma,
			})

			// create the associated type
			await createDesignType({
				designId: design.id,
				type,
				prisma,
			})

			// update operations to be executed in parallel
			const updateOperations = []

			// if there is a previous design, connect it to the new design
			if (previousDesign) {
				updateOperations.push(
					...connectPrevAndNextDesignsPromise({
						prevId: previousDesign.id,
						nextId: design.id,
						prisma,
					}),
				)
			}

			// if there are no visible designs, set the new design as selected
			if (visibleDesignsCount === 0) {
				// Fetch artboard for selected designs
				const fetchArtboardPromise = findArtboardTransactionPromise({
					id: artboardId,
					prisma,
				})

				// Execute fetch operations in parallel
				const [artboard] = await Promise.all([fetchArtboardPromise])

				// if the artboard exists (it should), update the selected design
				if (artboard) {
					updateOperations.push(
						updateArtboardSelectedDesignPromise({
							artboard,
							designId: design.id,
							type,
							prisma,
						}),
					)
				}
			}

			// Execute all update operations in parallel
			await Promise.all(updateOperations)
		})

		return { success: true }
	} catch (error) {
		console.log(error)
		return { error: true }
	}
}

const fetchArtboardDesignTypeTail = async ({
	artboardId,
	type,
	prisma,
}: {
	artboardId: Artboard['id']
	type: designTypeEnum
	prisma: PrismaTransactionType
}) => {
	return await prisma.design.findFirst({
		where: { type, artboardId, nextId: null },
	})
}

const createDesign = async ({
	userId,
	artboardId,
	type,
	prisma,
}: {
	userId: User['id']
	artboardId: Artboard['id']
	type: designTypeEnum
	prisma: PrismaTransactionType
}) => {
	// validate the design type is valid
	const data = designSchema.parse({
		type,
		ownerId: userId,
		artboardId,
	})
	return await prisma.design.create({ data })
}

const createDesignType = async ({
	designId,
	type,
	prisma,
}: {
	designId: Design['id']
	type: designTypeEnum
	prisma: PrismaTransactionType
}) => {
	const data = { designId }

	// each design type has a default value set in the schema
	switch (type) {
		case 'palette':
			return await prisma.palette.create({ data })
		case 'size':
			return await prisma.size.create({ data })
		case 'fill':
			return await prisma.fill.create({ data })
		case 'stroke':
			return await prisma.stroke.create({ data })
		case 'line':
			return await prisma.line.create({ data })
		case 'rotate':
			return await prisma.rotate.create({ data })
		case 'layout':
			return await prisma.layout.create({ data })
		case 'template':
			return await prisma.template.create({ data })
	}
}
