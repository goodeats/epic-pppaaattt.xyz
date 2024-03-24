import { type User, type Design, type Layer } from '@prisma/client'
import {
	type IDesignCreateOverrides,
	findFirstDesign,
	connectPrevAndNextDesigns,
	updateLayerSelectedDesign,
} from '#app/models/design.server'
import { type IPaletteCreateOverrides } from '#app/models/palette.server'
import {
	LayerDesignDataCreateSchema,
	type designTypeEnum,
} from '#app/schema/design'
import { prisma } from '#app/utils/db.server'

type layerDesignCreateServiceProps = {
	userId: User['id']
	layerId: Layer['id']
	type: designTypeEnum
	designOverrides?: IDesignCreateOverrides
	designTypeOverrides?: IPaletteCreateOverrides
}

export const layerDesignCreateService = async ({
	userId,
	layerId,
	type,
	designOverrides = {},
	designTypeOverrides = {},
}: layerDesignCreateServiceProps) => {
	try {
		// Step 1: find existing layer designs tail
		const tailDesign = await getLayerDesignsTail({
			layerId,
			type,
		})

		// Step 2: create design before its associated type
		const createdDesign = await createDesign({
			userId,
			layerId,
			type,
			designOverrides,
		})

		// Step 3: create the associated design type
		await createDesignType({
			designId: createdDesign.id,
			type,
			designTypeOverrides,
		})

		// Step 4: connect new design to tail design, if it exists
		if (tailDesign) {
			const connectDesignsPromise = connectPrevAndNextDesigns({
				prevId: tailDesign.id,
				nextId: createdDesign.id,
			})
			await prisma.$transaction(connectDesignsPromise)
		}

		// Step 5: update selected design, if selected
		if (designOverrides.selected) {
			const updateSelectedDesignPromise = updateLayerSelectedDesign({
				layerId,
				designId: createdDesign.id,
				type,
			})
			await prisma.$transaction(updateSelectedDesignPromise)
		}

		return { success: true }
	} catch (error) {
		console.log(error)
		return { error: true }
	}
}

const getLayerDesignsTail = async ({
	layerId,
	type,
}: {
	layerId: Layer['id']
	type: designTypeEnum
}) => {
	return await findFirstDesign({
		where: { type, layerId, nextId: null },
	})
}

const createDesign = async ({
	userId,
	layerId,
	type,
	designOverrides,
}: {
	userId: User['id']
	layerId: Layer['id']
	type: designTypeEnum
	designOverrides?: IDesignCreateOverrides
}) => {
	const data = LayerDesignDataCreateSchema.parse({
		type,
		ownerId: userId,
		layerId,
		...designOverrides,
	})
	const createdDesign = await prisma.design.create({ data })

	if (!createdDesign) throw new Error('Design was not created')

	return createdDesign
}

const createDesignType = async ({
	designId,
	type,
	designTypeOverrides,
}: {
	designId: Design['id']
	type: designTypeEnum
	designTypeOverrides?: IPaletteCreateOverrides
}) => {
	const data = { designId, ...designTypeOverrides }

	// each design type has a default value set in the schema
	switch (type) {
		case 'palette':
			return await prisma.palette.create({ data })
		case 'size':
		// return await prisma.size.create({ data })
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
