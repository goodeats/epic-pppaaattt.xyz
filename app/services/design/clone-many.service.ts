import { type User } from '@prisma/client'
import { findManyDesignsWithType } from '#app/models/design/design.get.server'
import {
	type IDesignParsed,
	type IDesignEntityId,
	type IDesignByType,
} from '#app/models/design/design.server'
import { groupDesignsByType } from '#app/models/design/utils'
import {
	DesignCloneSourceTypeEnum,
	type designCloneSourceTypeEnum,
} from '#app/schema/design'
import { type ICloneDesignsStrategy } from '#app/strategies/design/clone.strategy'
import { cloneDesignTypeStrategies } from '#app/strategies/design-type/clone.strategy'
import { cloneDesignTypesService } from './design-type/clone-many.service'

export const cloneDesignsService = async ({
	userId,
	sourceEntityType,
	sourceEntityId,
	targetEntityId,
	entityStrategy,
}: {
	userId: User['id']
	sourceEntityType: designCloneSourceTypeEnum
	sourceEntityId: IDesignEntityId
	targetEntityId: IDesignEntityId
	entityStrategy: ICloneDesignsStrategy
}) => {
	try {
		// Step 1: get entity designs
		const sourceDesigns = await getSourceEntityDesigns({
			sourceEntityType,
			sourceEntityId,
		})

		// Step 2: separate designs by type and order
		const sourceDesignsByType = groupDesignsByType({
			designs: sourceDesigns,
		})

		// Step 4: create new designs for each type
		await cloneDesignsByType({
			userId,
			targetEntityId,
			sourceDesignsByType,
			entityStrategy,
		})

		return { success: true }
	} catch (error) {
		console.log('cloneDesignsService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}

const getSourceEntityDesigns = async ({
	sourceEntityType,
	sourceEntityId,
}: {
	sourceEntityType: designCloneSourceTypeEnum
	sourceEntityId: IDesignEntityId
}): Promise<IDesignParsed[]> => {
	const where =
		sourceEntityType === DesignCloneSourceTypeEnum.ARTWORK_VERSION
			? { artworkVersionId: sourceEntityId }
			: { layerId: sourceEntityId }

	return await findManyDesignsWithType({ where })
}

const cloneDesignsByType = async ({
	userId,
	targetEntityId,
	sourceDesignsByType,
	entityStrategy,
}: {
	userId: User['id']
	targetEntityId: IDesignEntityId
	sourceDesignsByType: IDesignByType
	entityStrategy: ICloneDesignsStrategy
}): Promise<void> => {
	// Iterate over each design type and clone accordingly
	for (const key of Object.keys(
		sourceDesignsByType,
	) as (keyof IDesignByType)[]) {
		const strategy = cloneDesignTypeStrategies[key]
		const designs = sourceDesignsByType[key]
		if (strategy && designs.length > 0) {
			await cloneDesignTypesService({
				userId,
				targetEntityId,
				designs,
				strategy,
				entityStrategy,
			})
		}
	}
}
