import { type User } from '@prisma/client'
import { type IArtboardVersion } from '#app/models/artboard-version.server'
import { type IArtboard } from '#app/models/artboard.server'
import {
	findManyDesignsWithType,
	type IDesignEntityId,
	type IDesignWithType,
	type IDesignCreateOverrides,
	type IDesignTypeCreateOverrides,
} from '#app/models/design.server'
import { type designTypeEnum } from '#app/schema/design'
import {
	type ICloneDesignsToEntityStrategy,
	cloneDesignsToEntity,
} from '../../design/clone-designs-to-entity.service'
import { artboardVersionDesignCreateService } from './design/create.service'

export class CloneDesignsToArtboardVersionStrategy
	implements ICloneDesignsToEntityStrategy
{
	async getSourceEntityDesigns({
		sourceEntityId,
	}: {
		sourceEntityId: IArtboard['id']
	}): Promise<IDesignWithType[]> {
		return await findManyDesignsWithType({
			where: { artboardVersionId: sourceEntityId },
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
		await artboardVersionDesignCreateService({
			userId,
			artboardVersionId: targetEntityId,
			type,
			designOverrides,
			designTypeOverrides,
		})
	}
}

export const artboardVersionCloneDesignsService = async ({
	userId,
	sourceEntityId,
	targetEntityId,
}: {
	userId: User['id']
	sourceEntityId: IDesignEntityId
	targetEntityId: IArtboardVersion['id']
}) => {
	try {
		const entityStrategy = new CloneDesignsToArtboardVersionStrategy()

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
