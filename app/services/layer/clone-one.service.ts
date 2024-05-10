import { type User } from '@prisma/client'
import {
	type ILayerWithDesigns,
	type ILayerEntityId,
	type ILayerCreateOverrides,
} from '#app/models/layer.server'
import { DesignCloneSourceTypeEnum } from '#app/schema/design'
import { type ICloneLayersStrategy } from '#app/strategies/layer/clone.strategy'
import { layerLayerCloneDesignsService } from './clone-designs.service'

export const cloneLayerService = async ({
	userId,
	sourceLayer,
	targetEntityId,
	entityStrategy,
}: {
	userId: User['id']
	sourceLayer: ILayerWithDesigns
	targetEntityId: ILayerEntityId
	entityStrategy: ICloneLayersStrategy
}) => {
	try {
		const { name, description, slug, visible } = sourceLayer

		// Step 1: set layer overrides
		const layerOverrides: ILayerCreateOverrides = {
			name,
			visible,
			// do not include description or slug if they are null
			...(description && { description }),
			...(slug && { slug }),
		}

		// Step 2: create entity layer
		const { success, message, createdLayer } =
			await entityStrategy.createEntityLayerService({
				userId,
				targetEntityId,
				layerOverrides,
			})

		// Step 3: handle errors
		if (!success || !createdLayer) {
			return { success: false, message }
		}

		// Step 4: clone designs
		await layerLayerCloneDesignsService({
			userId,
			sourceEntityType: DesignCloneSourceTypeEnum.LAYER,
			sourceEntityId: sourceLayer.id,
			targetEntityId: createdLayer.id,
		})

		return { success: true }
	} catch (error) {
		console.log('cloneLayersToEntity error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
