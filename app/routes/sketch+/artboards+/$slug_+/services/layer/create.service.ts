import { type User } from '@prisma/client'
import {
	type ILayerCreateOverrides,
	connectPrevAndNextLayers,
	type ILayerEntityId,
	type ILayer,
} from '#app/models/layer.server'
import { prisma } from '#app/utils/db.server'
import { layerCloneDesignsService } from '../artboard/layer/clone-designs.service'

export interface ICreateLayerStrategy {
	getEntityLayersTail(args: {
		targetEntityId: ILayerEntityId
	}): Promise<ILayer | null>
	getEntityLayersCount(args: {
		targetEntityId: ILayerEntityId
	}): Promise<number>
	createEntityLayer(args: {
		userId: User['id']
		targetEntityId: ILayerEntityId
		layerOverrides: ILayerCreateOverrides
	}): Promise<ILayer | null>
}

export const layerCreateService = async ({
	userId,
	targetEntityId,
	layerOverrides = {},
	skipCloneDesigns = false,
	strategy,
}: {
	userId: User['id']
	targetEntityId: ILayerEntityId
	skipCloneDesigns?: boolean
	layerOverrides?: ILayerCreateOverrides
	strategy: ICreateLayerStrategy
}) => {
	console.log('using the shared later create service')
	try {
		// Step 1: find existing entity layers tail
		const tail = await strategy.getEntityLayersTail({
			targetEntityId,
		})

		// Step 2: ensure layer name is set
		// either by overrides or default
		layerOverrides.name = await createLayerNameDefault({
			targetEntityId,
			layerOverrides,
			strategy,
		})

		// Step 3: create new layer
		const createdLayer = await strategy.createEntityLayer({
			userId,
			targetEntityId,
			layerOverrides,
		})
		if (!createdLayer) throw new Error('Layer was not created')

		// Step 4: connect new layer to tail layer if there is one
		if (tail) {
			const connectLayersPromise = connectPrevAndNextLayers({
				prevId: tail.id,
				nextId: createdLayer.id,
			})
			await prisma.$transaction(connectLayersPromise)
		}

		// Step 4: copy designs from artboard to created layer
		// 🚨 IF CLONING LAYERS
		if (!skipCloneDesigns) {
			await layerCloneDesignsService({
				userId,
				sourceEntityId: targetEntityId,
				targetEntityId: createdLayer.id,
			})
		}

		return { createdLayer, success: true }
	} catch (error) {
		console.log('layerCreateService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}

const createLayerNameDefault = async ({
	targetEntityId,
	layerOverrides,
	strategy,
}: {
	targetEntityId: ILayerEntityId
	layerOverrides: ILayerCreateOverrides
	strategy: ICreateLayerStrategy
}): Promise<string> => {
	// if overrides has a name, use it
	// likely from cloning a layer before creating it
	if (layerOverrides.name) return layerOverrides.name

	// set layer names by the count of layers
	const layersCount = await strategy.getEntityLayersCount({
		targetEntityId,
	})
	return `Layer ${layersCount + 1}`
}
