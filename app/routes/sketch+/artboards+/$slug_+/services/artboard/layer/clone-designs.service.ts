import { type User } from '@prisma/client'
import {
	findManyDesignsWithType,
	type IDesignEntityId,
	type IDesignWithType,
	type IDesignCreateOverrides,
	type IDesignTypeCreateOverrides,
} from '#app/models/design.server'
import { type ILayer } from '#app/models/layer.server'
import { type designTypeEnum } from '#app/schema/design'
import {
	cloneDesignsToEntity,
	type ICloneDesignsToEntityStrategy,
} from '../../design/clone-designs-to-entity.service'
import { layerDesignCreateService } from '../../layer/design/create.service'

export class CloneDesignsToLayerStrategy
	implements ICloneDesignsToEntityStrategy
{
	async getSourceEntityDesigns({
		sourceEntityId,
	}: {
		sourceEntityId: ILayer['id']
	}): Promise<IDesignWithType[]> {
		return await findManyDesignsWithType({
			where: { artboardId: sourceEntityId },
		})
	}

	async createEntityDesignService({
		userId,
		targetEntityId,
		type,
		designOverrides,
		designTypeOverrides,
	}: {
		userId: User['id']
		targetEntityId: IDesignEntityId
		type: designTypeEnum
		designOverrides?: IDesignCreateOverrides
		designTypeOverrides?: IDesignTypeCreateOverrides
	}): Promise<void> {
		await layerDesignCreateService({
			userId,
			layerId: targetEntityId,
			type,
			designOverrides,
			designTypeOverrides,
		})
	}
}

export const layerCloneDesignsService = async ({
	userId,
	sourceEntityId,
	targetEntityId,
}: {
	userId: User['id']
	sourceEntityId: IDesignEntityId
	targetEntityId: ILayer['id']
}) => {
	console.log('yoooooo')
	try {
		const entityStrategy = new CloneDesignsToLayerStrategy()

		await cloneDesignsToEntity({
			userId,
			sourceEntityId,
			targetEntityId,
			entityStrategy,
		})
	} catch (error) {
		console.log(error)
		return { error: true }
	}
}
