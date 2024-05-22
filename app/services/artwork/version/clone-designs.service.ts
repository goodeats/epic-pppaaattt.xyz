import { type User } from '@prisma/client'
import { type IArtworkVersion } from '#app/models/artwork-version/artwork-version.server'
import { type IDesignEntityId } from '#app/models/design/design.server'
import { type designCloneSourceTypeEnum } from '#app/schema/design'
import { CloneDesignsToArtworkVersionStrategy } from '#app/strategies/design/clone.strategy'
import { cloneDesignsService } from '../../design/clone-many.service'

export const artworkVersionCloneDesignsService = async ({
	userId,
	sourceEntityType,
	sourceEntityId,
	targetEntityId,
}: {
	userId: User['id']
	sourceEntityType: designCloneSourceTypeEnum
	sourceEntityId: IDesignEntityId
	targetEntityId: IArtworkVersion['id']
}) => {
	try {
		const entityStrategy = new CloneDesignsToArtworkVersionStrategy()

		await cloneDesignsService({
			userId,
			sourceEntityType,
			sourceEntityId,
			targetEntityId,
			entityStrategy,
		})
	} catch (error) {
		console.log('artworkVersionCloneDesignsService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
