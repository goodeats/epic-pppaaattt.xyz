import { type User } from '@prisma/client'
import {
	type IDesignCreateOverrides,
	connectPrevAndNextDesigns,
	type IDesignTypeCreateOverrides,
	type IDesign,
	type IDesignEntityId,
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
import { prisma } from '#app/utils/db.server'
import {
	updateSelectedDesignService,
	type IUpdateSelectedDesignStrategy,
} from './update-selected.service'

export interface ICreateDesignStrategy {
	getDesignsByTypeTail(args: {
		entityId: IDesignEntityId
		type: designTypeEnum
	}): Promise<IDesign | null>
	createDesign(args: {
		userId: User['id']
		entityId: IDesignEntityId
		type: designTypeEnum
		designOverrides: IDesignCreateOverrides
	}): Promise<IDesign | null>
	visibleDesignsByTypeCount(args: {
		entityId: IDesignEntityId
		type: designTypeEnum
	}): Promise<number>
}

export const designCreateService = async ({
	userId,
	entityId,
	type,
	designOverrides = {},
	designTypeOverrides = {},
	strategy,
	updateSelectedDesignStrategy,
}: {
	userId: User['id']
	entityId: IDesignEntityId
	type: designTypeEnum
	designOverrides?: IDesignCreateOverrides
	designTypeOverrides?: IDesignTypeCreateOverrides
	strategy: ICreateDesignStrategy
	updateSelectedDesignStrategy: IUpdateSelectedDesignStrategy
}) => {
	try {
		// Step 1: find existing layer designs tail
		const tailDesign = await strategy.getDesignsByTypeTail({
			entityId,
			type,
		})

		// Step 2: create design before its associated type
		const createdDesign = await strategy.createDesign({
			userId,
			entityId,
			type,
			designOverrides,
		})
		if (!createdDesign) throw new Error('Design was not created')

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
			entityId,
			type,
			designOverrides,
			strategy,
		})
		if (shouldSetSelected) {
			await updateSelectedDesignService({
				entityId,
				designId: createdDesign.id,
				type,
				strategy: updateSelectedDesignStrategy,
			})
		}

		return { success: true }
	} catch (error) {
		console.log(error)
		return { error: true }
	}
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
	entityId,
	type,
	designOverrides,
	strategy,
}: {
	entityId: IDesignEntityId
	type: designTypeEnum
	designOverrides: IDesignCreateOverrides
	strategy: ICreateDesignStrategy
}) => {
	const { visible, selected } = designOverrides
	if (selected) {
		return true
	}
	if (visible === false) {
		return false
	}

	const visibleLayerDesignsByTypeCount =
		await strategy.visibleDesignsByTypeCount({
			entityId,
			type,
		})

	// check if newly created design is the only visible design
	// and therefore should be selected
	return visibleLayerDesignsByTypeCount === 1
}
