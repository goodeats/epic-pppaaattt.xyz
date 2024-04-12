import { type User } from '@prisma/client'
import { getLayersWithDesigns } from '#app/models/layer/layer.get.server'
import {
	type ILayerWithDesigns,
	type ILayerEntityId,
} from '#app/models/layer.server'
import {
	LayerCloneSourceTypeEnum,
	type layerCloneSourceTypeEnum,
} from '#app/schema/layer'
import { type ICloneLayersStrategy } from '#app/strategies/layer/clone.strategy'
import { orderLinkedItems } from '#app/utils/linked-list.utils'
import { cloneLayerService } from './clone-one.service'

export const cloneLayersService = async ({
	userId,
	sourceEntityType,
	sourceEntityId,
	targetEntityId,
	entityStrategy,
}: {
	userId: User['id']
	sourceEntityType: layerCloneSourceTypeEnum
	sourceEntityId: ILayerEntityId
	targetEntityId: ILayerEntityId
	entityStrategy: ICloneLayersStrategy
}) => {
	try {
		const sourceLayers = await getSourceEntityLayers({
			sourceEntityType,
			sourceEntityId,
		})

		for (const [, sourceLayer] of sourceLayers.entries()) {
			await cloneLayerService({
				userId,
				targetEntityId,
				sourceLayer,
				entityStrategy,
			})
		}

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

// Step 1: get entity layers
// Step 2: re-order layers as linked list
const getSourceEntityLayers = async ({
	sourceEntityType,
	sourceEntityId,
}: {
	sourceEntityType: layerCloneSourceTypeEnum
	sourceEntityId: ILayerEntityId
}): Promise<ILayerWithDesigns[]> => {
	const where =
		sourceEntityType === LayerCloneSourceTypeEnum.ARTBOARD
			? { artboardId: sourceEntityId }
			: LayerCloneSourceTypeEnum.ARTBOARD_VERSION
			  ? { artboardVersionId: sourceEntityId }
			  : { layerId: sourceEntityId }

	const layers = await getLayersWithDesigns({ where })
	const orderedLayers = await orderLinkedItems<ILayerWithDesigns>(layers)
	return orderedLayers
}
