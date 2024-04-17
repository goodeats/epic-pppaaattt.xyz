import { type User } from '@prisma/client'
import { type IArtboardVersion } from '#app/models/artboard-version/artboard-version.server'
import { type IArtboard } from '#app/models/artboard.server'
import { createDesign } from '#app/models/design/design.create.server'
import {
	findFirstDesign,
	type IDesign,
	type IDesignCreateOverrides,
	type IDesignEntityId,
} from '#app/models/design.server'
import { type ILayer } from '#app/models/layer.server'
import { type designTypeEnum } from '#app/schema/design'
import { ArtboardDesignDataCreateSchema } from '#app/schema/design-artboard'
import { ArtboardVersionDesignDataCreateSchema } from '#app/schema/design-artboard-version'
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
		return await findFirstDesign({
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

		const butthead = await createDesign({ data })
		return butthead
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
		return await findFirstDesign({
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
		const data = ArtboardVersionDesignDataCreateSchema.parse({
			type,
			ownerId: userId,
			artboardVersionId: targetEntityId,
			...designOverrides,
		})
		return await prisma.design.create({ data })
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

export class ArtboardCreateDesignStrategy implements ICreateDesignStrategy {
	async getDesignsByTypeTail({
		targetEntityId,
		type,
	}: {
		targetEntityId: IArtboard['id']
		type: designTypeEnum
	}): Promise<IDesign | null> {
		return await findFirstDesign({
			where: { type, artboardId: targetEntityId, nextId: null },
		})
	}

	async createEntityDesign({
		userId,
		targetEntityId,
		type,
		designOverrides,
	}: {
		userId: User['id']
		targetEntityId: IArtboard['id']
		type: designTypeEnum
		designOverrides: IDesignCreateOverrides
	}): Promise<IDesign | null> {
		const data = ArtboardDesignDataCreateSchema.parse({
			type,
			ownerId: userId,
			artboardId: targetEntityId,
			...designOverrides,
		})
		return await prisma.design.create({ data })
	}

	async visibleDesignsByTypeCount({
		targetEntityId,
		type,
	}: {
		targetEntityId: IArtboard['id']
		type: designTypeEnum
	}): Promise<number> {
		const visibleDesignsByTypeCount = await prisma.design.count({
			where: { artboardId: targetEntityId, type, visible: true },
		})
		return Number(visibleDesignsByTypeCount)
	}
}
