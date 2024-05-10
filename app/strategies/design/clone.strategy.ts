import { type User } from '@prisma/client'
import { type IDesignCreatedResponse } from '#app/models/design/design.create.server'
import {
	type IDesignTypeCreateOverrides,
	type IDesignCreateOverrides,
	type IDesignEntityId,
} from '#app/models/design/design.server'
import { type designTypeEnum } from '#app/schema/design'
import { artboardVersionDesignCreateService } from '#app/services/artboard/version/design/create.service'
import { layerDesignCreateService } from '#app/services/layer/design/create.service'

export interface ICloneDesignsStrategy {
	createEntityDesignService(args: {
		userId: User['id']
		targetEntityId: IDesignEntityId
		type: designTypeEnum
		designOverrides?: IDesignCreateOverrides
		designTypeOverrides?: IDesignTypeCreateOverrides
	}): Promise<IDesignCreatedResponse>
}

export class CloneDesignToLayerStrategy implements ICloneDesignsStrategy {
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
	}): Promise<IDesignCreatedResponse> {
		return await layerDesignCreateService({
			userId,
			layerId: targetEntityId,
			type,
			designOverrides,
			designTypeOverrides,
		})
	}
}

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
	}): Promise<IDesignCreatedResponse> {
		return await artboardVersionDesignCreateService({
			userId,
			artboardVersionId: targetEntityId,
			type,
			designOverrides,
			designTypeOverrides,
		})
	}
}
