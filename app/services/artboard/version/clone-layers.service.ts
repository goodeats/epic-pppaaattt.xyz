import { type User } from '@prisma/client'
import { type IArtboardVersion } from '#app/models/artboard-version/artboard-version.server'
import { type ILayerEntityId } from '#app/models/layer.server'
import { type layerCloneSourceTypeEnum } from '#app/schema/layer'
import { CloneLayersToArtboardVersionStrategy } from '#app/strategies/layer/clone.strategy'
import { cloneLayersService } from '../../layer/clone-many.service'

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
