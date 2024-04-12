import { type User } from '@prisma/client'
import {
	type IDesignTypeCreateOverrides,
	type IDesignCreateOverrides,
	type IDesignEntityId,
	type IDesignWithType,
	type IDesignsByType,
} from '#app/models/design.server'
import { type designTypeEnum } from '#app/schema/design'
import { filterAndOrderDesignsByType } from '#app/utils/design'
import {
	cloneDesignTypesToEntity,
	designTypeStrategies,
} from './design-type/clone-design-types.service'

export interface ICloneDesignsToEntityStrategy {
	getSourceEntityDesigns(args: {
		sourceEntityId: IDesignEntityId
	}): Promise<IDesignWithType[]>
	createEntityDesignService(args: {
		userId: User['id']
		targetEntityId: IDesignEntityId
		type: designTypeEnum
		designOverrides?: IDesignCreateOverrides
		designTypeOverrides?: IDesignTypeCreateOverrides
	}): Promise<void>
}

export const cloneDesignsToEntity = async ({
	userId,
	sourceEntityId,
	targetEntityId,
	entityStrategy,
}: {
	userId: User['id']
	sourceEntityId: IDesignEntityId
	targetEntityId: IDesignEntityId
	entityStrategy: ICloneDesignsToEntityStrategy
}) => {
	try {
		// Step 1: get entity designs
		const sourceDesigns = await entityStrategy.getSourceEntityDesigns({
			sourceEntityId,
		})

		// Step 2: separate designs by type and order
		const designsByType = filterAndOrderDesignsByType({
			designs: sourceDesigns,
		})

		// Step 4: create new designs for each type
		await cloneDesignsByType({
			userId,
			targetEntityId,
			designsByType,
			entityStrategy,
		})

		return { success: true }
	} catch (error) {
		console.log(error)
		return { error: true }
	}
}

const cloneDesignsByType = async ({
	userId,
	targetEntityId,
	designsByType,
	entityStrategy,
}: {
	userId: User['id']
	targetEntityId: IDesignEntityId
	designsByType: IDesignsByType
	entityStrategy: ICloneDesignsToEntityStrategy
}): Promise<void> => {
	// Iterate over each design type and clone accordingly
	for (const key of Object.keys(designsByType) as (keyof IDesignsByType)[]) {
		const strategy = designTypeStrategies[key]
		const designs = designsByType[key]
		if (strategy && designs.length > 0) {
			await cloneDesignTypesToEntity({
				userId,
				targetEntityId,
				designs,
				strategy,
				entityStrategy,
			})
		}
	}
}
