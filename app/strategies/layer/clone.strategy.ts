import { type User } from '@prisma/client'
import { type ILayerCreatedResponse } from '#app/models/layer/layer.create.server'
import {
	type ILayerCreateOverrides,
	type ILayerEntityId,
} from '#app/models/layer.server'
import { artboardVersionLayerCreateService } from '#app/routes/sketch+/artboards+/$slug_+/services/artboard/version/layer/create.service'

export interface ICloneLayersStrategy {
	createEntityLayerService(args: {
		userId: User['id']
		targetEntityId: ILayerEntityId
		layerOverrides: ILayerCreateOverrides
	}): Promise<ILayerCreatedResponse>
}

export class CloneLayersToArtboardVersionStrategy
	implements ICloneLayersStrategy
{
	async createEntityLayerService({
		userId,
		targetEntityId,
		layerOverrides,
	}: {
		userId: User['id']
		targetEntityId: ILayerEntityId
		layerOverrides?: ILayerCreateOverrides
	}): Promise<ILayerCreatedResponse> {
		return await artboardVersionLayerCreateService({
			userId,
			artboardVersionId: targetEntityId,
			layerOverrides,
			// need to create layer before cloning designs
			// later, perhaps pass designs along
			// or pass back promise to execute in transaction
			skipCloneDesigns: true,
		})
	}
}
