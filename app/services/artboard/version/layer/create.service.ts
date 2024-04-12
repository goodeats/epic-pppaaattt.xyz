import { type User } from '@prisma/client'
import { type IArtboardVersion } from '#app/models/artboard-version.server'
import { type ILayerCreatedResponse } from '#app/models/layer/layer.create.server'
import { type ILayerCreateOverrides } from '#app/models/layer.server'
import { ArtboardVersionCreateLayerStrategy } from '#app/strategies/layer/create.strategy'
import { layerCreateService } from '../../../layer/create.service'

export const artboardVersionLayerCreateService = async ({
	userId,
	artboardVersionId,
	layerOverrides = {},
	skipCloneDesigns = false,
}: {
	userId: User['id']
	artboardVersionId: IArtboardVersion['id']
	layerOverrides?: ILayerCreateOverrides
	skipCloneDesigns?: boolean
}): Promise<ILayerCreatedResponse> => {
	try {
		const strategy = new ArtboardVersionCreateLayerStrategy()
		return await layerCreateService({
			userId,
			targetEntityId: artboardVersionId,
			layerOverrides,
			skipCloneDesigns,
			strategy,
		})
	} catch (error) {
		console.log('artboardVersionLayerCreateService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
