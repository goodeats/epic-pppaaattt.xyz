import { type User } from '@prisma/client'
import {
	type ILayerWithDesigns,
	type ILayerEntityId,
	type ILayerCreateOverrides,
} from '#app/models/layer.server'
import { orderLinkedItems } from '#app/utils/linked-list.utils'

export interface ICloneLayersToEntityStrategy {
	getSourceEntityLayers(args: {
		sourceEntityId: ILayerEntityId
	}): Promise<ILayerWithDesigns[]>
	createEntityLayerService(args: {
		userId: User['id']
		targetEntityId: ILayerEntityId
		layerOverrides: ILayerCreateOverrides
	}): Promise<void>
}

export const cloneLayersToEntity = async ({
	userId,
	sourceEntityId,
	targetEntityId,
	entityStrategy,
}: {
	userId: User['id']
	sourceEntityId: ILayerEntityId
	targetEntityId: ILayerEntityId
	entityStrategy: ICloneLayersToEntityStrategy
}) => {
	try {
		// Step 1: get entity layers
		const entityLayers = await entityStrategy.getSourceEntityLayers({
			sourceEntityId,
		})

		// Step 2: re-order layers as linked list
		const layers = orderLinkedItems<ILayerWithDesigns>(entityLayers)

		// Step 4: create new designs for each type
		await cloneLayers({
			userId,
			targetEntityId,
			layers,
			entityStrategy,
		})

		return { success: true }
	} catch (error) {
		console.log(error)
		return { error: true }
	}
}

const cloneLayers = async ({
	userId,
	targetEntityId,
	layers,
	entityStrategy,
}: {
	userId: User['id']
	targetEntityId: ILayerEntityId
	layers: ILayerWithDesigns[]
	entityStrategy: ICloneLayersToEntityStrategy
}): Promise<void> => {
	// Step 2: loop entity design types
	// kinda weird way to set the loop up, but it works
	for (const [, layer] of layers.entries()) {
		const { name, description, slug, visible } = layer as ILayerWithDesigns

		// Step 3: set layer overrides
		const layerOverrides = {
			name,
			description,
			slug,
			visible,
		} as ILayerCreateOverrides

		// Step 6: create design type
		await entityStrategy.createEntityLayerService({
			userId,
			targetEntityId,
			layerOverrides, // layer attributes
		})
	}
}
