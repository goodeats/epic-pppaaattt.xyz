import { type User } from '@prisma/client'
import {
	type IDesignTypeCreateOverrides,
	type IDesignCreateOverrides,
	type IDesignEntityId,
	type IDesignWithType,
	type IDesignsByType,
	findManyDesignsWithType,
} from '#app/models/design.server'
import {
	DesignCloneSourceTypeEnum,
	type designCloneSourceTypeEnum,
	type designTypeEnum,
} from '#app/schema/design'
import { filterAndOrderDesignsByType } from '#app/utils/design'
import {
	cloneDesignTypesService,
	designTypeStrategies,
} from './design-type/clone.service'

export interface ICloneDesignsStrategy {
	createEntityDesignService(args: {
		userId: User['id']
		targetEntityId: IDesignEntityId
		type: designTypeEnum
		designOverrides?: IDesignCreateOverrides
		designTypeOverrides?: IDesignTypeCreateOverrides
	}): Promise<void>
}

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
	console.log(
		'😂 cloneDesignsService...',
		{ sourceEntityId },
		{ targetEntityId },
	)

	try {
		// Step 1: get entity designs
		const sourceDesigns = await getSourceEntityDesigns({
			sourceEntityType,
			sourceEntityId,
		})
		console.log('source design count: ', sourceDesigns.length)

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

const getSourceEntityDesigns = async ({
	sourceEntityType,
	sourceEntityId,
}: {
	sourceEntityType: designCloneSourceTypeEnum
	sourceEntityId: IDesignEntityId
}): Promise<IDesignWithType[]> => {
	const where =
		sourceEntityType === DesignCloneSourceTypeEnum.ARTBOARD
			? { artboardId: sourceEntityId }
			: DesignCloneSourceTypeEnum.ARTBOARD_VERSION
			  ? { artboardVersionId: sourceEntityId }
			  : { layerId: sourceEntityId }

	return await findManyDesignsWithType({ where })
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
	entityStrategy: ICloneDesignsStrategy
}): Promise<void> => {
	console.log('😂😂 cloneDesignsByType...')

	// Iterate over each design type and clone accordingly
	for (const key of Object.keys(designsByType) as (keyof IDesignsByType)[]) {
		const strategy = designTypeStrategies[key]
		const designs = designsByType[key]
		console.log(key, designs.length)
		if (strategy && designs.length > 0) {
			console.log('😂😂😂 cloneDesignTypesService...')
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
