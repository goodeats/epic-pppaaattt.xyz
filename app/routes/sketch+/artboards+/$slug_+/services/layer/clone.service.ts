import { type User } from '@prisma/client'
import { type ILayerCreatedResponse } from '#app/models/layer/layer.create.server'
import {
	type ILayerWithDesigns,
	type ILayerEntityId,
	type ILayerCreateOverrides,
} from '#app/models/layer.server'
import { orderLinkedItems } from '#app/utils/linked-list.utils'
import { layerLayerCloneDesignsService } from './clone-designs.service'

export interface ICloneLayersStrategy {
	getSourceEntityLayers(args: {
		sourceEntityId: ILayerEntityId
	}): Promise<ILayerWithDesigns[]>
	createEntityLayerService(args: {
		userId: User['id']
		targetEntityId: ILayerEntityId
		layerOverrides: ILayerCreateOverrides
	}): Promise<ILayerCreatedResponse>
}

export const cloneLayersService = async ({
	userId,
	sourceEntityId,
	targetEntityId,
	entityStrategy,
}: {
	userId: User['id']
	sourceEntityId: ILayerEntityId
	targetEntityId: ILayerEntityId
	entityStrategy: ICloneLayersStrategy
}) => {
	try {
		// Step 1: get entity layers
		const sourceLayers = await entityStrategy.getSourceEntityLayers({
			sourceEntityId,
		})

		// Step 2: re-order layers as linked list
		const layers = orderLinkedItems<ILayerWithDesigns>(sourceLayers)

		// Step 3: clone new layers and thier designs
		await cloneLayersToEntity({
			userId,
			targetEntityId,
			layers,
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

const cloneLayersToEntity = async ({
	userId,
	targetEntityId,
	layers,
	entityStrategy,
}: {
	userId: User['id']
	targetEntityId: ILayerEntityId
	layers: ILayerWithDesigns[]
	entityStrategy: ICloneLayersStrategy
}) => {
	// kinda weird way to set the loop up, but it works
	for (const [, layer] of layers.entries()) {
		cloneLayerToEntity({
			userId,
			targetEntityId,
			layer,
			entityStrategy,
		})
	}
}

const cloneLayerToEntity = async ({
	userId,
	targetEntityId,
	layer,
	entityStrategy,
}: {
	userId: User['id']
	targetEntityId: ILayerEntityId
	layer: ILayerWithDesigns
	entityStrategy: ICloneLayersStrategy
}) => {
	const { name, description, slug, visible } = layer
	console.log('layer.designs:', layer.designs)

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
		sourceEntityId: layer.id,
		targetEntityId: createdLayer.id,
	})
}
