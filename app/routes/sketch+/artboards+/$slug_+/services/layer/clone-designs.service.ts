import { type User } from '@prisma/client'
import { type IDesignEntityId } from '#app/models/design.server'
import { type ILayer } from '#app/models/layer.server'
import { type designCloneSourceTypeEnum } from '#app/schema/design'
import { CloneDesignToLayerStrategy } from '#app/strategies/design/clone.strategy'
import { cloneDesignsService } from '../design/clone-many.service'

export const layerLayerCloneDesignsService = async ({
	userId,
	sourceEntityType,
	sourceEntityId,
	targetEntityId,
}: {
	userId: User['id']
	sourceEntityType: designCloneSourceTypeEnum
	sourceEntityId: IDesignEntityId
	targetEntityId: ILayer['id']
}) => {
	try {
		const entityStrategy = new CloneDesignToLayerStrategy()
		await cloneDesignsService({
			userId,
			sourceEntityType,
			sourceEntityId,
			targetEntityId,
			entityStrategy,
		})
	} catch (error) {
		console.log('layerLayerCloneDesignsService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
