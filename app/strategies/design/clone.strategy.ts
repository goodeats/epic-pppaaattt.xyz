import { type IDesignCreatedResponse } from '#app/models/design/design.create.server'
import {
	type IDesignTypeCreateOverrides,
	type IDesignCreateOverrides,
	type IDesignEntityId,
} from '#app/models/design/design.server'
import { type IUser } from '#app/models/user/user.server'
import { type designTypeEnum } from '#app/schema/design'
import { artworkVersionDesignCreateService } from '#app/services/artwork/version/design/create.service'
import { layerDesignCreateService } from '#app/services/layer/design/create.service'

export interface ICloneDesignsStrategy {
	createEntityDesignService(args: {
		userId: IUser['id']
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
		userId: IUser['id']
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

export class CloneDesignsToArtworkVersionStrategy
	implements ICloneDesignsStrategy
{
	async createEntityDesignService({
		userId,
		targetEntityId,
		type,
		designOverrides,
		designTypeOverrides,
	}: {
		userId: IUser['id']
		targetEntityId: IDesignEntityId
		type: designTypeEnum
		designOverrides?: IDesignCreateOverrides
		designTypeOverrides?: IDesignTypeCreateOverrides
	}): Promise<IDesignCreatedResponse> {
		return await artworkVersionDesignCreateService({
			userId,
			artworkVersionId: targetEntityId,
			type,
			designOverrides,
			designTypeOverrides,
		})
	}
}
