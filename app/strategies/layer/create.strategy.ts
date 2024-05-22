import { type User } from '@prisma/client'
import { type IArtworkVersion } from '#app/models/artwork-version/artwork-version.server'
import { createLayer } from '#app/models/layer/layer.create.server'
import {
	findFirstLayer,
	type ILayer,
	type ILayerCreateOverrides,
	type ILayerEntityId,
} from '#app/models/layer/layer.server'
import { DesignCloneSourceTypeEnum } from '#app/schema/design'
import { ArtworkVersionLayerDataCreateSchema } from '#app/schema/layer-artwork-version'
import { artworkVersionLayerCloneDesignsService } from '#app/services/artwork/version/layer/clone-designs.service'
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

export class ArtworkVersionCreateLayerStrategy
	implements ICreateLayerStrategy
{
	async getEntityLayersTail({
		targetEntityId,
	}: {
		targetEntityId: IArtworkVersion['id']
	}): Promise<ILayer | null> {
		return await findFirstLayer({
			where: { artworkVersionId: targetEntityId, nextId: null },
		})
	}

	async createEntityLayer({
		userId,
		targetEntityId,
		layerOverrides,
	}: {
		userId: User['id']
		targetEntityId: IArtworkVersion['id']
		layerOverrides: ILayerCreateOverrides
	}): Promise<ILayer> {
		const data = ArtworkVersionLayerDataCreateSchema.parse({
			ownerId: userId,
			artworkVersionId: targetEntityId,
			...layerOverrides,
		})
		const createdLayer = await createLayer({ data })
		return createdLayer
	}

	async getEntityLayersCount({
		targetEntityId,
	}: {
		targetEntityId: IArtworkVersion['id']
	}): Promise<number> {
		return await prisma.layer.count({
			where: { artworkVersionId: targetEntityId },
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
		await artworkVersionLayerCloneDesignsService({
			userId,
			sourceEntityType: DesignCloneSourceTypeEnum.ARTWORK_VERSION,
			sourceEntityId,
			targetEntityId,
		})
	}
}
