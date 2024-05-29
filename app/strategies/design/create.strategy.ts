import { type User } from '@prisma/client'
import { type IArtworkVersion } from '#app/models/artwork-version/artwork-version.server'
import {
	createArtworkVersionDesign,
	createDesign,
} from '#app/models/design/design.create.server'
import { getDesign } from '#app/models/design/design.get.server'
import {
	type IDesign,
	type IDesignCreateOverrides,
	type IDesignEntityId,
} from '#app/models/design/design.server'
import { type ILayer } from '#app/models/layer/layer.server'
import { type designTypeEnum } from '#app/schema/design'
import { ArtworkVersionDesignDataCreateSchema } from '#app/schema/design-artwork-version'
import { LayerDesignDataCreateSchema } from '#app/schema/design-layer'
import { prisma } from '#app/utils/db.server'

export interface ICreateDesignStrategy {
	getDesignsByTypeTail(args: {
		targetEntityId: IDesignEntityId
		type: designTypeEnum
	}): Promise<IDesign | null>
	createEntityDesign(args: {
		userId: User['id']
		targetEntityId: IDesignEntityId
		type: designTypeEnum
		designOverrides: IDesignCreateOverrides
	}): Promise<IDesign | null>
	visibleDesignsByTypeCount(args: {
		targetEntityId: IDesignEntityId
		type: designTypeEnum
	}): Promise<number>
}

export class LayerCreateDesignStrategy implements ICreateDesignStrategy {
	async getDesignsByTypeTail({
		targetEntityId,
		type,
	}: {
		targetEntityId: ILayer['id']
		type: designTypeEnum
	}): Promise<IDesign | null> {
		return await getDesign({
			where: { type, layerId: targetEntityId, nextId: null },
		})
	}

	async createEntityDesign({
		userId,
		targetEntityId,
		type,
		designOverrides,
	}: {
		userId: User['id']
		targetEntityId: ILayer['id']
		type: designTypeEnum
		designOverrides: IDesignCreateOverrides
	}): Promise<IDesign | null> {
		const data = LayerDesignDataCreateSchema.parse({
			type,
			ownerId: userId,
			layerId: targetEntityId,
			...designOverrides,
		})

		return await createDesign({ data })
	}

	async visibleDesignsByTypeCount({
		targetEntityId,
		type,
	}: {
		targetEntityId: ILayer['id']
		type: designTypeEnum
	}): Promise<number> {
		const visibleDesignsByTypeCount = await prisma.design.count({
			where: { layerId: targetEntityId, type, visible: true },
		})
		return Number(visibleDesignsByTypeCount)
	}
}

export class ArtworkVersionCreateDesignStrategy
	implements ICreateDesignStrategy
{
	async getDesignsByTypeTail({
		targetEntityId,
		type,
	}: {
		targetEntityId: IArtworkVersion['id']
		type: designTypeEnum
	}): Promise<IDesign | null> {
		return await getDesign({
			where: { type, artworkVersionId: targetEntityId, nextId: null },
		})
	}

	async createEntityDesign({
		userId,
		targetEntityId,
		type,
		designOverrides,
	}: {
		userId: User['id']
		targetEntityId: IArtworkVersion['id']
		type: designTypeEnum
		designOverrides: IDesignCreateOverrides
	}): Promise<IDesign | null> {
		const data = ArtworkVersionDesignDataCreateSchema.parse({
			type,
			ownerId: userId,
			artworkVersionId: targetEntityId,
			...designOverrides,
		})

		return await createArtworkVersionDesign({
			data,
		})
	}

	async visibleDesignsByTypeCount({
		targetEntityId,
		type,
	}: {
		targetEntityId: IArtworkVersion['id']
		type: designTypeEnum
	}): Promise<number> {
		const visibleDesignsByTypeCount = await prisma.design.count({
			where: { artworkVersionId: targetEntityId, type, visible: true },
		})
		return Number(visibleDesignsByTypeCount)
	}
}
