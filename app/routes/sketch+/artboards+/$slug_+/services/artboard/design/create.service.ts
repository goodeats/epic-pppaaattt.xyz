import { type User } from '@prisma/client'
import {
	type IDesignCreateOverrides,
	type IDesignTypeCreateOverrides,
	findFirstDesign,
	connectPrevAndNextDesigns,
	type IDesign,
} from '#app/models/design.server'
import { createDesignFill } from '#app/models/fill.server'
import { createDesignLayout } from '#app/models/layout.server'
import { createDesignLine } from '#app/models/line.server'
import { createDesignPalette } from '#app/models/palette.server'
import { createDesignRotate } from '#app/models/rotate.server'
import { createDesignSize } from '#app/models/size.server'
import { createDesignStroke } from '#app/models/stroke.server'
import { createDesignTemplate } from '#app/models/template.server'
import { type designTypeEnum } from '#app/schema/design'
import { ArtboardDesignDataCreateSchema } from '#app/schema/design-artboard'
import { prisma, type IArtboard } from '#app/utils/db.server'
import { artboardUpdateSelectedDesignService } from './update-selected.service'

export const artboardDesignCreateService = async ({
	userId,
	artboardId,
	type,
	designOverrides = {},
	designTypeOverrides = {},
}: {
	userId: User['id']
	artboardId: IArtboard['id']
	type: designTypeEnum
	designOverrides?: IDesignCreateOverrides
	designTypeOverrides?: IDesignTypeCreateOverrides
}) => {
	try {
		// Step 1: find existing artboard designs tail
		const tailDesign = await getArtboardDesignsTail({
			artboardId,
			type,
		})

		// Step 2: create design before its associated type
		const createdDesign = await createDesign({
			userId,
			artboardId,
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
			artboardId,
			type,
			designOverrides,
		})
		if (shouldSetSelected) {
			await artboardUpdateSelectedDesignService({
				artboardId,
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

const getArtboardDesignsTail = async ({
	artboardId,
	type,
}: {
	artboardId: IArtboard['id']
	type: designTypeEnum
}) => {
	return await findFirstDesign({
		where: { type, artboardId, nextId: null },
	})
}

const createDesign = async ({
	userId,
	artboardId,
	type,
	designOverrides,
}: {
	userId: User['id']
	artboardId: IArtboard['id']
	type: designTypeEnum
	designOverrides: IDesignCreateOverrides
}) => {
	const data = ArtboardDesignDataCreateSchema.parse({
		type,
		ownerId: userId,
		artboardId,
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
	designId: IDesign['id']
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
	artboardId,
	type,
	designOverrides,
}: {
	artboardId: IArtboard['id']
	type: designTypeEnum
	designOverrides: IDesignCreateOverrides
}) => {
	const { visible, selected } = designOverrides
	if (selected) {
		return true
	}
	if (!visible) {
		return false
	}

	const visibleLayerDesignsByTypeCount = await prisma.design.count({
		where: { artboardId, type, visible: true },
	})

	// check if newly created design is the only visible design
	// and therefore should be selected
	return Number(visibleLayerDesignsByTypeCount) === 1
}
