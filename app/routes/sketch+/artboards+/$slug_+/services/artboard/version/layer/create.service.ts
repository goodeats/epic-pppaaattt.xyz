import { type User } from '@prisma/client'
import { type IArtboardVersion } from '#app/models/artboard-version.server'
import {
	createLayer,
	type ILayerCreatedResponse,
} from '#app/models/layer/layer.create.server'
import {
	type ILayerCreateOverrides,
	findFirstLayer,
	type ILayer,
	type ILayerEntityId,
} from '#app/models/layer.server'
import { DesignCloneSourceTypeEnum } from '#app/schema/design'
import { ArtboardVersionLayerDataCreateSchema } from '#app/schema/layer-artboard-version'
import { prisma } from '#app/utils/db.server'
import {
	layerCreateService,
	type ICreateLayerStrategy,
} from '../../../layer/create.service'
import { artboardVersionLayerCloneDesignsService } from './clone-designs.service'

export class ArtboardVersionCreateLayerStrategy
	implements ICreateLayerStrategy
{
	async getEntityLayersTail({
		targetEntityId,
	}: {
		targetEntityId: IArtboardVersion['id']
	}): Promise<ILayer | null> {
		return await findFirstLayer({
			where: { artboardVersionId: targetEntityId, nextId: null },
		})
	}

	async createEntityLayer({
		userId,
		targetEntityId,
		layerOverrides,
	}: {
		userId: User['id']
		targetEntityId: IArtboardVersion['id']
		layerOverrides: ILayerCreateOverrides
	}): Promise<ILayer> {
		const data = ArtboardVersionLayerDataCreateSchema.parse({
			ownerId: userId,
			artboardVersionId: targetEntityId,
			...layerOverrides,
		})
		return await createLayer({ data })
	}

	async getEntityLayersCount({
		targetEntityId,
	}: {
		targetEntityId: IArtboardVersion['id']
	}): Promise<number> {
		return await prisma.layer.count({
			where: { artboardVersionId: targetEntityId },
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
		await artboardVersionLayerCloneDesignsService({
			userId,
			sourceEntityType: DesignCloneSourceTypeEnum.ARTBOARD_VERSION,
			sourceEntityId,
			targetEntityId,
		})
	}
}

export const artboardVersionLayerCreateService = async ({
	userId,
	artboardVersionId,
	layerOverrides = {},
	skipCloneDesigns = false,
}: {
	userId: User['id']
	artboardVersionId: IArtboardVersion['id']
	layerOverrides?: ILayerCreateOverrides
	skipCloneDesigns?: boolean
}): Promise<ILayerCreatedResponse> => {
	try {
		const strategy = new ArtboardVersionCreateLayerStrategy()
		return await layerCreateService({
			userId,
			targetEntityId: artboardVersionId,
			layerOverrides,
			skipCloneDesigns,
			strategy,
		})
	} catch (error) {
		console.log('artboardVersionLayerCreateService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
