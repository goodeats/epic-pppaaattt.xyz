import { type User, type Design, type Layer } from '@prisma/client'
import { connectPrevAndNextDesignsPromise } from '#app/models/design.server'
import { designSchema, type designTypeEnum } from '#app/schema/design'
import { type PrismaTransactionType, prisma } from '#app/utils/db.server'

type layerDesignCreateServiceProps = {
	userId: User['id']
	layerId: Layer['id']
	type: designTypeEnum
	visibleDesignsCount: number
	designOptions?: {
		visible: boolean
	}
	designTypeOptions?: {
		[key: string]: any
	}
}

export const layerDesignCreateService = async ({
	userId,
	layerId,
	type,
	visibleDesignsCount,
	designOptions,
	designTypeOptions,
}: layerDesignCreateServiceProps) => {
	try {
		await prisma.$transaction(async prisma => {
			// initialize promises array to run in parallel at the end
			const promises = []

			// Step 1: find existing layer designs tail
			const tailDesign = await fetchLayerDesignTypeTail({
				layerId,
				type,
				prisma,
			})

			// Step 2: create design before its associated type
			const design = await createDesign({
				userId,
				layerId,
				type,
				designOptions,
				prisma,
			})

			// Step 3: create the associated type
			await createDesignType({
				designId: design.id,
				type,
				designTypeOptions,
				prisma,
			})

			// Step 4: connect new design to tail design if it exists
			if (tailDesign) {
				promises.push(
					...connectPrevAndNextDesignsPromise({
						prevId: tailDesign.id,
						nextId: design.id,
						prisma,
					}),
				)
			}

			// if there are no visible designs, set the new design as selected
			if (visibleDesignsCount === 0) {
				const updateSelectedPromise = updateDesignToSelected({
					layerId,
					design,
					type,
					prisma,
				})
				promises.push(updateSelectedPromise)
			}

			// Execute all update operations in parallel
			await Promise.all(promises)
		})

		return { success: true }
	} catch (error) {
		console.log(error)
		return { error: true }
	}
}

const fetchLayerDesignTypeTail = async ({
	layerId,
	type,
	prisma,
}: {
	layerId: Layer['id']
	type: designTypeEnum
	prisma: PrismaTransactionType
}) => {
	return await prisma.design.findFirst({
		where: { type, layerId, nextId: null },
	})
}

const createDesign = async ({
	userId,
	layerId,
	type,
	designOptions,
	prisma,
}: {
	userId: User['id']
	layerId: Layer['id']
	type: designTypeEnum
	designOptions?: {
		visible: boolean
	}
	prisma: PrismaTransactionType
}) => {
	// validate the design type is valid
	const data = designSchema.parse({
		type,
		ownerId: userId,
		layerId,
		...designOptions,
	})
	return await prisma.design.create({ data })
}

const createDesignType = async ({
	designId,
	type,
	designTypeOptions,
	prisma,
}: {
	designId: Design['id']
	type: designTypeEnum
	designTypeOptions?: {
		visible?: boolean
	}
	prisma: PrismaTransactionType
}) => {
	const data = { designId, ...designTypeOptions }

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

const updateDesignToSelected = ({
	layerId,
	design,
	type,
	prisma,
}: {
	layerId: Layer['id']
	design: Design
	type: designTypeEnum
	prisma: PrismaTransactionType
}) => {
	// ensure no current selected design for type
	return prisma.design.update({
		where: { id: design.id },
		data: {
			selected: true,
		},
	})
}
