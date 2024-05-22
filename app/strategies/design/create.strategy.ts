import { type User } from '@prisma/client'
import { type IArtboardVersion } from '#app/models/artboard-version/artboard-version.server'
import {
	createArtboardVersionDesign,
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

export class ArtboardVersionCreateDesignStrategy
	implements ICreateDesignStrategy
{
	async getDesignsByTypeTail({
		targetEntityId,
		type,
	}: {
		targetEntityId: IArtboardVersion['id']
		type: designTypeEnum
	}): Promise<IDesign | null> {
		return await getDesign({
			where: { type, artboardVersionId: targetEntityId, nextId: null },
		})
	}

	async createEntityDesign({
		userId,
		targetEntityId,
		type,
		designOverrides,
	}: {
		userId: User['id']
		targetEntityId: IArtboardVersion['id']
		type: designTypeEnum
		designOverrides: IDesignCreateOverrides
	}): Promise<IDesign | null> {
		const data = {
			ownerId: userId,
			type,
			artboardVersionId: targetEntityId,
			...designOverrides,
		}
		return await createArtboardVersionDesign({
			data,
		})
	}

	async visibleDesignsByTypeCount({
		targetEntityId,
		type,
	}: {
		targetEntityId: IArtboardVersion['id']
		type: designTypeEnum
	}): Promise<number> {
		const visibleDesignsByTypeCount = await prisma.design.count({
			where: { artboardVersionId: targetEntityId, type, visible: true },
		})
		return Number(visibleDesignsByTypeCount)
	}
}
