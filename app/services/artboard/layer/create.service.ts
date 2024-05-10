import { type User, type Artboard } from '@prisma/client'
import { type ILayerCreatedResponse } from '#app/models/layer/layer.create.server'
import { type ILayerCreateOverrides } from '#app/models/layer/layer.server'
import { ArtboardCreateLayerStrategy } from '#app/strategies/layer/create.strategy'
import { layerCreateService } from '../../layer/create.service'

export const artboardLayerCreateService = async ({
	userId,
	artboardId,
	layerOverrides = {},
	skipCloneDesigns = false,
}: {
	userId: User['id']
	artboardId: Artboard['id']
	layerOverrides?: ILayerCreateOverrides
	skipCloneDesigns?: boolean
}): Promise<ILayerCreatedResponse> => {
	try {
		const strategy = new ArtboardCreateLayerStrategy()
		return await layerCreateService({
			userId,
			targetEntityId: artboardId,
			layerOverrides,
			skipCloneDesigns,
			strategy,
		})
	} catch (error) {
		console.log('artboardLayerCreateService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
