import { type User, type Artboard } from '@prisma/client'
import { type IArtboard } from '#app/models/artboard.server'
import {
	createLayer,
	type ILayerCreatedResponse,
} from '#app/models/layer/layer.create.server'
import {
	type ILayer,
	type ILayerCreateOverrides,
	findFirstLayer,
	type ILayerEntityId,
} from '#app/models/layer.server'
import { ArtboardLayerDataCreateSchema } from '#app/schema/layer-artboard'
import { prisma } from '#app/utils/db.server'
import {
	layerCreateService,
	type ICreateLayerStrategy,
} from '../../layer/create.service'
import { artboardLayerCloneDesignsService } from './clone-designs.service'

export class ArtboardCreateLayerStrategy implements ICreateLayerStrategy {
	async getEntityLayersTail({
		targetEntityId,
	}: {
		targetEntityId: IArtboard['id']
	}): Promise<ILayer | null> {
		return await findFirstLayer({
			where: { artboardId: targetEntityId, nextId: null },
		})
	}

	async createEntityLayer({
		userId,
		targetEntityId,
		layerOverrides,
	}: {
		userId: User['id']
		targetEntityId: IArtboard['id']
		layerOverrides: ILayerCreateOverrides
	}): Promise<ILayer> {
		const data = ArtboardLayerDataCreateSchema.parse({
			ownerId: userId,
			artboardId: targetEntityId,
			...layerOverrides,
		})
		return await createLayer({ data })
	}

	async getEntityLayersCount({
		targetEntityId,
	}: {
		targetEntityId: IArtboard['id']
	}): Promise<number> {
		return await prisma.layer.count({
			where: { artboardId: targetEntityId },
		})
	}

	async layerCloneDesignsService({
		userId,
		sourceEntityId,
		targetEntityId,
	}: {
		userId: User['id']
		sourceEntityId: ILayerEntityId
		targetEntityId: ILayerEntityId
	}) {
		await artboardLayerCloneDesignsService({
			userId,
			sourceEntityId,
			targetEntityId,
		})
	}
}

export const artboardLayerCreateService = async ({
	userId,
	artboardId,
	layerOverrides = {},
	skipCloneDesigns = false,
}: {
	userId: User['id']
	artboardId: Artboard['id']
	layerOverrides?: ILayerCreateOverrides
	skipCloneDesigns?: boolean
}): Promise<ILayerCreatedResponse> => {
	try {
		const strategy = new ArtboardCreateLayerStrategy()
		return await layerCreateService({
			userId,
			targetEntityId: artboardId,
			layerOverrides,
			skipCloneDesigns,
			strategy,
		})
	} catch (error) {
		console.log('artboardLayerCreateService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
