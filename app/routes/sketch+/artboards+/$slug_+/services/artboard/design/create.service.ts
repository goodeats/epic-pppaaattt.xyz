import { type User } from '@prisma/client'
import { type IArtboard } from '#app/models/artboard.server'
import {
	type IDesignCreateOverrides,
	type IDesignTypeCreateOverrides,
	findFirstDesign,
} from '#app/models/design.server'
import { type designTypeEnum } from '#app/schema/design'
import { ArtboardDesignDataCreateSchema } from '#app/schema/design-artboard'
import { prisma } from '#app/utils/db.server'
import {
	designCreateService,
	type ICreateDesignStrategy,
} from '../../design/create.service'
import { ArtboardUpdateSelectedDesignStrategy } from './update-selected.service'

export class ArtboardCreateDesignStrategy implements ICreateDesignStrategy {
	async getDesignsByTypeTail({
		entityId,
		type,
	}: {
		entityId: IArtboard['id']
		type: designTypeEnum
	}) {
		return await findFirstDesign({
			where: { type, artboardId: entityId, nextId: null },
		})
	}

	async createDesign({
		userId,
		entityId,
		type,
		designOverrides,
	}: {
		userId: User['id']
		entityId: IArtboard['id']
		type: designTypeEnum
		designOverrides: IDesignCreateOverrides
	}) {
		const data = ArtboardDesignDataCreateSchema.parse({
			type,
			ownerId: userId,
			artboardId: entityId,
			...designOverrides,
		})
		return await prisma.design.create({ data })
	}

	async visibleDesignsByTypeCount({
		entityId,
		type,
	}: {
		entityId: IArtboard['id']
		type: designTypeEnum
	}) {
		const visibleDesignsByTypeCount = await prisma.design.count({
			where: { artboardId: entityId, type, visible: true },
		})
		return Number(visibleDesignsByTypeCount)
	}
}

export const artboardDesignCreateService = async ({
	userId,
	artboardId,
	type,
	designOverrides = {},
	designTypeOverrides = {},
}: {
	userId: User['id']
	artboardId: IArtboard['id']
	type: designTypeEnum
	designOverrides?: IDesignCreateOverrides
	designTypeOverrides?: IDesignTypeCreateOverrides
}) => {
	try {
		const strategy = new ArtboardCreateDesignStrategy()
		const updateSelectedDesignStrategy =
			new ArtboardUpdateSelectedDesignStrategy()
		return designCreateService({
			userId,
			entityId: artboardId,
			type,
			designOverrides: designOverrides || {},
			designTypeOverrides: designTypeOverrides || {},
			strategy,
			updateSelectedDesignStrategy,
		})
	} catch (error) {
		console.log(error)
		return { error: true }
	}
}
