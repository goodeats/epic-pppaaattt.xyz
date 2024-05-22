import { type User } from '@prisma/client'
import {
	type IDesignEntityId,
	type IDesignWithType,
	type IDesignsByType,
	findManyDesignsWithType,
} from '#app/models/design/design.server'
import {
	DesignCloneSourceTypeEnum,
	type designCloneSourceTypeEnum,
} from '#app/schema/design'
import { type ICloneDesignsStrategy } from '#app/strategies/design/clone.strategy'
import { cloneDesignTypeStrategies } from '#app/strategies/design-type/clone.strategy'
import { filterAndOrderDesignsByType } from '#app/utils/design'
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
		const sourceDesignsByType = filterAndOrderDesignsByType({
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
}): Promise<IDesignWithType[]> => {
	const where =
		sourceEntityType === DesignCloneSourceTypeEnum.ARTBOARD_VERSION
			? { artboardVersionId: sourceEntityId }
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
	sourceDesignsByType: IDesignsByType
	entityStrategy: ICloneDesignsStrategy
}): Promise<void> => {
	// Iterate over each design type and clone accordingly
	for (const key of Object.keys(
		sourceDesignsByType,
	) as (keyof IDesignsByType)[]) {
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
