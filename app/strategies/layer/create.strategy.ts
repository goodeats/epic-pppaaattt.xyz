import { type User } from '@prisma/client'
import { type IArtboardVersion } from '#app/models/artboard-version/artboard-version.server'
import { createLayer } from '#app/models/layer/layer.create.server'
import {
	findFirstLayer,
	type ILayer,
	type ILayerCreateOverrides,
	type ILayerEntityId,
} from '#app/models/layer/layer.server'
import { DesignCloneSourceTypeEnum } from '#app/schema/design'
import { ArtboardVersionLayerDataCreateSchema } from '#app/schema/layer-artboard-version'
import { artboardVersionLayerCloneDesignsService } from '#app/services/artboard/version/layer/clone-designs.service'
import { prisma } from '#app/utils/db.server'

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
	layerCloneDesignsService(args: {
		userId: User['id']
		sourceEntityId: ILayerEntityId
		targetEntityId: ILayerEntityId
	}): Promise<void>
}

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
		const createdLayer = await createLayer({ data })
		return createdLayer
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
