import { type User, type Design, type Layer } from '@prisma/client'
import {
	type IDesignCreateOverrides,
	findFirstDesign,
	connectPrevAndNextDesigns,
	updateLayerSelectedDesign,
	type IDesignTypeCreateOverrides,
} from '#app/models/design.server'
import { createDesignFill } from '#app/models/fill.server'
import { createDesignLine } from '#app/models/line.server'
import { createDesignPalette } from '#app/models/palette.server'
import { createDesignSize } from '#app/models/size.server'
import { createDesignStroke } from '#app/models/stroke.server'
import {
	LayerDesignDataCreateSchema,
	type designTypeEnum,
} from '#app/schema/design'
import { prisma } from '#app/utils/db.server'

export const layerDesignCreateService = async ({
	userId,
	layerId,
	type,
	designOverrides = {},
	designTypeOverrides = {},
}: {
	userId: User['id']
	layerId: Layer['id']
	type: designTypeEnum
	designOverrides?: IDesignCreateOverrides
	designTypeOverrides?: IDesignTypeCreateOverrides
}) => {
	try {
		// Step 1: find existing layer designs tail
		const tailDesign = await getLayerDesignsTail({
			layerId,
			type,
		})

		// Step 2: create design before its associated type
		console.log('creating design')
		const createdDesign = await createDesign({
			userId,
			layerId,
			type,
			designOverrides,
		})
		console.log('created design', createdDesign)

		// Step 3: create the associated design type
		console.log('creating design type')
		const createdDesignTypePromise = createDesignType({
			designId: createdDesign.id,
			type,
			designTypeOverrides,
		})
		await prisma.$transaction([createdDesignTypePromise])
		console.log('created design type')

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
	designOverrides: IDesignCreateOverrides
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

const createDesignType = ({
	designId,
	type,
	designTypeOverrides,
}: {
	designId: Design['id']
	type: designTypeEnum
	designTypeOverrides: IDesignTypeCreateOverrides
}) => {
	switch (type) {
		case 'palette':
			return createDesignPalette({
				designId,
				designTypeOverrides,
			})
		case 'size':
			return createDesignSize({
				designId,
				designTypeOverrides,
			})
		case 'fill':
			return createDesignFill({
				designId,
				designTypeOverrides,
			})
		case 'stroke':
			return createDesignStroke({
				designId,
				designTypeOverrides,
			})
		case 'line':
			return createDesignLine({
				designId,
				designTypeOverrides,
			})
		// case 'rotate':
		// 	return await prisma.rotate.create({ data })
		// case 'layout':
		// 	return await prisma.layout.create({ data })
		// case 'template':
		// 	return await prisma.template.create({ data })
		default:
			throw new Error(`Design type not found: ${type}`)
	}
}
