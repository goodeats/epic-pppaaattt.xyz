import { type User } from '@prisma/client'
import { type IArtworkVersion } from '#app/models/artwork-version/artwork-version.server'
import { type ILayerEntityId } from '#app/models/layer/layer.server'
import { type layerCloneSourceTypeEnum } from '#app/schema/layer'
import { CloneLayersToArtworkVersionStrategy } from '#app/strategies/layer/clone.strategy'
import { cloneLayersService } from '../../layer/clone-many.service'

export const artworkVersionCloneLayersService = async ({
	userId,
	sourceEntityType,
	sourceEntityId,
	targetEntityId,
}: {
	userId: User['id']
	sourceEntityType: layerCloneSourceTypeEnum
	sourceEntityId: ILayerEntityId
	targetEntityId: IArtworkVersion['id']
}) => {
	try {
		const entityStrategy = new CloneLayersToArtworkVersionStrategy()

		await cloneLayersService({
			userId,
			sourceEntityType,
			sourceEntityId,
			targetEntityId,
			entityStrategy,
		})
	} catch (error) {
		console.log('artworkVersionCloneLayersService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
