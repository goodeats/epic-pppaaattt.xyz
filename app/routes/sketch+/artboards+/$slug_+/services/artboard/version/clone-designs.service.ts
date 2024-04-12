import { type User } from '@prisma/client'
import { type IArtboardVersion } from '#app/models/artboard-version.server'
import {
	type IDesignEntityId,
	type IDesignCreateOverrides,
	type IDesignTypeCreateOverrides,
} from '#app/models/design.server'
import {
	type designCloneSourceTypeEnum,
	type designTypeEnum,
} from '#app/schema/design'
import {
	cloneDesignsService,
	type ICloneDesignsStrategy,
} from '../../design/clone-many.service'
import { artboardVersionDesignCreateService } from './design/create.service'

export class CloneDesignsToArtboardVersionStrategy
	implements ICloneDesignsStrategy
{
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
	sourceEntityType,
	sourceEntityId,
	targetEntityId,
}: {
	userId: User['id']
	sourceEntityType: designCloneSourceTypeEnum
	sourceEntityId: IDesignEntityId
	targetEntityId: IArtboardVersion['id']
}) => {
	try {
		const entityStrategy = new CloneDesignsToArtboardVersionStrategy()

		await cloneDesignsService({
			userId,
			sourceEntityType,
			sourceEntityId,
			targetEntityId,
			entityStrategy,
		})
	} catch (error) {
		console.log(error)
		return { error: true }
	}
}
