import { type User } from '@prisma/client'
import { type ILayerCreatedResponse } from '#app/models/layer/layer.create.server'
import { getLayersWithDesigns } from '#app/models/layer/layer.get.server'
import {
	type ILayerWithDesigns,
	type ILayerEntityId,
	type ILayerCreateOverrides,
} from '#app/models/layer.server'
import { DesignCloneSourceTypeEnum } from '#app/schema/design'
import {
	LayerCloneSourceTypeEnum,
	type layerCloneSourceTypeEnum,
} from '#app/schema/layer'
import { orderLinkedItems } from '#app/utils/linked-list.utils'
import { layerLayerCloneDesignsService } from './clone-designs.service'

export interface ICloneLayersStrategy {
	createEntityLayerService(args: {
		userId: User['id']
		targetEntityId: ILayerEntityId
		layerOverrides: ILayerCreateOverrides
	}): Promise<ILayerCreatedResponse>
}

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
		// Step 1: get entity layers
		const sourceLayers = await getSourceEntityLayers({
			sourceEntityType,
			sourceEntityId,
		})

		// Step 2: re-order layers as linked list
		const orderedLayers = orderLinkedItems<ILayerWithDesigns>(sourceLayers)

		// Step 3: clone new layers and thier designs
		await cloneLayersToEntity({
			userId,
			targetEntityId,
			sourceLayers: orderedLayers,
			entityStrategy,
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

	return await getLayersWithDesigns({ where })
}

const cloneLayersToEntity = async ({
	userId,
	targetEntityId,
	sourceLayers,
	entityStrategy,
}: {
	userId: User['id']
	targetEntityId: ILayerEntityId
	sourceLayers: ILayerWithDesigns[]
	entityStrategy: ICloneLayersStrategy
}) => {
	// kinda weird way to set the loop up, but it works
	for (const [, sourceLayer] of sourceLayers.entries()) {
		cloneLayerToEntity({
			userId,
			targetEntityId,
			sourceLayer,
			entityStrategy,
		})
	}
}

const cloneLayerToEntity = async ({
	userId,
	targetEntityId,
	sourceLayer,
	entityStrategy,
}: {
	userId: User['id']
	targetEntityId: ILayerEntityId
	sourceLayer: ILayerWithDesigns
	entityStrategy: ICloneLayersStrategy
}) => {
	const { name, description, slug, visible } = sourceLayer

	// Step 1: set layer overrides
	const layerOverrides = {
		name,
		description,
		slug,
		visible,
	} as ILayerCreateOverrides

	// Step 2: create entity layer
	const { success, message, createdLayer } =
		await entityStrategy.createEntityLayerService({
			userId,
			targetEntityId,
			layerOverrides,
		})

	// Step 3: handle errors
	if (!success || !createdLayer) {
		console.log('cloneLayers error:', message)
		return { success: false }
	}

	// Step 4: clone designs
	await layerLayerCloneDesignsService({
		userId,
		sourceEntityType: DesignCloneSourceTypeEnum.LAYER,
		sourceEntityId: sourceLayer.id,
		targetEntityId: createdLayer.id,
	})
}
