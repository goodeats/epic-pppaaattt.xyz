import { type User } from '@prisma/client'
import { type IArtworkVersion } from '#app/models/artwork-version/artwork-version.server'
import { type ILayerCreatedResponse } from '#app/models/layer/layer.create.server'
import { type ILayerCreateOverrides } from '#app/models/layer/layer.server'
import { ArtworkVersionCreateLayerStrategy } from '#app/strategies/layer/create.strategy'
import { layerCreateService } from '../../../layer/create.service'

export const artworkVersionLayerCreateService = async ({
	userId,
	artworkVersionId,
	layerOverrides = {},
	skipCloneDesigns = false,
}: {
	userId: User['id']
	artworkVersionId: IArtworkVersion['id']
	layerOverrides?: ILayerCreateOverrides
	skipCloneDesigns?: boolean
}): Promise<ILayerCreatedResponse> => {
	try {
		const strategy = new ArtworkVersionCreateLayerStrategy()
		return await layerCreateService({
			userId,
			targetEntityId: artworkVersionId,
			layerOverrides,
			skipCloneDesigns,
			strategy,
		})
	} catch (error) {
		console.log('artworkVersionLayerCreateService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
