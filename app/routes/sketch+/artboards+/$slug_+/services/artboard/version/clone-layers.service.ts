import { type User } from '@prisma/client'
import { type IArtboardVersion } from '#app/models/artboard-version.server'
import { type ILayerCreatedResponse } from '#app/models/layer/layer.create.server'
import { getLayersWithDesigns } from '#app/models/layer/layer.get.server'
import {
	type ILayerWithDesigns,
	type ILayerEntityId,
	type ILayerCreateOverrides,
} from '#app/models/layer.server'
import {
	cloneLayersService,
	type ICloneLayersStrategy,
} from '../../layer/clone.service'
import { artboardVersionLayerCreateService } from './layer/create.service'

export class CloneLayersToArtboardVersionStrategy
	implements ICloneLayersStrategy
{
	async getSourceEntityLayers({
		sourceEntityId,
	}: {
		sourceEntityId: ILayerEntityId
	}): Promise<ILayerWithDesigns[]> {
		return await getLayersWithDesigns({
			where: { artboardId: sourceEntityId },
		})
	}

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
			skipCloneDesigns: true,
		})
	}
}

export const artboardVersionCloneLayersService = async ({
	userId,
	sourceEntityId,
	targetEntityId,
}: {
	userId: User['id']
	sourceEntityId: ILayerEntityId
	targetEntityId: IArtboardVersion['id']
}) => {
	try {
		const entityStrategy = new CloneLayersToArtboardVersionStrategy()

		await cloneLayersService({
			userId,
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
