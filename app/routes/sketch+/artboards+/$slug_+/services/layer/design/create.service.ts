import { type User, type Design, type Layer } from '@prisma/client'
import {
	type IDesignCreateOverrides,
	findFirstDesign,
	connectPrevAndNextDesigns,
	type IDesignTypeCreateOverrides,
} from '#app/models/design.server'
import { createDesignFill } from '#app/models/fill.server'
import { createDesignLayout } from '#app/models/layout.server'
import { createDesignLine } from '#app/models/line.server'
import { createDesignPalette } from '#app/models/palette.server'
import { createDesignRotate } from '#app/models/rotate.server'
import { createDesignSize } from '#app/models/size.server'
import { createDesignStroke } from '#app/models/stroke.server'
import { createDesignTemplate } from '#app/models/template.server'
import {
	LayerDesignDataCreateSchema,
	type designTypeEnum,
} from '#app/schema/design'
import { prisma } from '#app/utils/db.server'
import { layerUpdateSelectedDesignService } from './update-selected.service'

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
		const createdDesign = await createDesign({
			userId,
			layerId,
			type,
			designOverrides,
		})

		// Step 3: create the associated design type
		const createdDesignTypePromise = createDesignType({
			designId: createdDesign.id,
			type,
			designTypeOverrides,
		})
		await prisma.$transaction([createdDesignTypePromise])

		// Step 4: connect new design to tail design, if it exists
		if (tailDesign) {
			const connectDesignsPromise = connectPrevAndNextDesigns({
				prevId: tailDesign.id,
				nextId: createdDesign.id,
			})
			await prisma.$transaction(connectDesignsPromise)
		}

		// Step 5: update selected design, if necessary
		const shouldSetSelected = await shouldUpdateSelectedDesign({
			layerId,
			type,
			designOverrides,
		})
		if (shouldSetSelected) {
			await layerUpdateSelectedDesignService({
				layerId,
				designId: createdDesign.id,
				type,
			})
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
		case 'rotate':
			return createDesignRotate({
				designId,
				designTypeOverrides,
			})
		case 'layout':
			return createDesignLayout({
				designId,
				designTypeOverrides,
			})
		case 'template':
			return createDesignTemplate({
				designId,
				designTypeOverrides,
			})
		default:
			throw new Error(`Design type not found: ${type}`)
	}
}

const shouldUpdateSelectedDesign = async ({
	layerId,
	type,
	designOverrides,
}: {
	layerId: Layer['id']
	type: designTypeEnum
	designOverrides: IDesignCreateOverrides
}) => {
	if (designOverrides.selected) {
		return true
	}

	const visibleLayerDesignsByTypeCount = await prisma.design.count({
		where: { layerId, type, visible: true },
	})

	return Number(visibleLayerDesignsByTypeCount) === 0
}
