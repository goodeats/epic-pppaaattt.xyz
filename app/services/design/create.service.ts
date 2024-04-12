import { type User } from '@prisma/client'
import { type IDesignCreatedResponse } from '#app/models/design/design.create.server'
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
import { type ICreateDesignStrategy } from '#app/strategies/design/create.strategy'
import { type IUpdateSelectedDesignStrategy } from '#app/strategies/design/update-selected.strategy'
import { prisma } from '#app/utils/db.server'
import { updateSelectedDesignService } from './update-selected.service'

export const designCreateService = async ({
	userId,
	targetEntityId,
	type,
	designOverrides = {},
	designTypeOverrides = {},
	strategy,
	updateSelectedDesignStrategy,
}: {
	userId: User['id']
	targetEntityId: IDesignEntityId
	type: designTypeEnum
	designOverrides?: IDesignCreateOverrides
	designTypeOverrides?: IDesignTypeCreateOverrides
	strategy: ICreateDesignStrategy
	updateSelectedDesignStrategy: IUpdateSelectedDesignStrategy
}): Promise<IDesignCreatedResponse> => {
	try {
		// Step 1: find existing layer designs tail
		const tailDesign = await strategy.getDesignsByTypeTail({
			targetEntityId,
			type,
		})

		// Step 2: create design before its associated type
		const createdDesign = await strategy.createEntityDesign({
			userId,
			targetEntityId,
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
			targetEntityId,
			type,
			designOverrides,
			strategy,
		})
		if (shouldSetSelected) {
			await updateSelectedDesignService({
				targetEntityId,
				designId: createdDesign.id,
				type,
				strategy: updateSelectedDesignStrategy,
			})
		}

		return { createdDesign, success: true }
	} catch (error) {
		console.log('designCreateService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
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
	targetEntityId,
	type,
	designOverrides,
	strategy,
}: {
	targetEntityId: IDesignEntityId
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
			targetEntityId,
			type,
		})

	// check if newly created design is the only visible design
	// and therefore should be selected
	return visibleLayerDesignsByTypeCount === 1
}
