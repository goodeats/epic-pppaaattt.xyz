import { type User } from '@prisma/client'
import { type IArtboardVersion } from '#app/models/artboard-version.server'
import { type ILayerCreatedResponse } from '#app/models/layer/layer.create.server'
import {
	type ILayerEntityId,
	type ILayerCreateOverrides,
} from '#app/models/layer.server'
import { type layerCloneSourceTypeEnum } from '#app/schema/layer'
import {
	cloneLayersService,
	type ICloneLayersStrategy,
} from '../../layer/clone.service'
import { artboardVersionLayerCreateService } from './layer/create.service'

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

export const artboardVersionCloneLayersService = async ({
	userId,
	sourceEntityType,
	sourceEntityId,
	targetEntityId,
}: {
	userId: User['id']
	sourceEntityType: layerCloneSourceTypeEnum
	sourceEntityId: ILayerEntityId
	targetEntityId: IArtboardVersion['id']
}) => {
	try {
		const entityStrategy = new CloneLayersToArtboardVersionStrategy()

		await cloneLayersService({
			userId,
			sourceEntityType,
			sourceEntityId,
			targetEntityId,
			entityStrategy,
		})
	} catch (error) {
		console.log('artboardVersionCloneLayersService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
