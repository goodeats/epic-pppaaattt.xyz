import { type User } from '@prisma/client'
import { type IArtboardVersion } from '#app/models/artboard-version/artboard-version.server'
import { type IDesignEntityId } from '#app/models/design.server'
import { type designCloneSourceTypeEnum } from '#app/schema/design'
import { CloneDesignsToArtboardVersionStrategy } from '#app/strategies/design/clone.strategy'
import { cloneDesignsService } from '../../design/clone-many.service'

export const artboardVersionCloneDesignsService = async ({
	userId,
	sourceEntityType,
	sourceEntityId,
	targetEntityId,
}: {
	userId: User['id']
	sourceEntityType: designCloneSourceTypeEnum
	sourceEntityId: IDesignEntityId
	targetEntityId: IArtboardVersion['id']
}) => {
	try {
		const entityStrategy = new CloneDesignsToArtboardVersionStrategy()

		await cloneDesignsService({
			userId,
			sourceEntityType,
			sourceEntityId,
			targetEntityId,
			entityStrategy,
		})
	} catch (error) {
		console.log('artboardVersionCloneDesignsService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
