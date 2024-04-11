import { type User } from '@prisma/client'
import { type IArtboardVersion } from '#app/models/artboard-version.server'
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
} from '../../../design/create.service'
import { ArtboardVersionUpdateSelectedDesignStrategy } from './update-selected.service'

export class ArtboardVersionCreateDesignStrategy
	implements ICreateDesignStrategy
{
	async getDesignsByTypeTail({
		entityId,
		type,
	}: {
		entityId: IArtboardVersion['id']
		type: designTypeEnum
	}) {
		return await findFirstDesign({
			where: { type, artboardVersionId: entityId, nextId: null },
		})
	}

	async createDesign({
		userId,
		entityId,
		type,
		designOverrides,
	}: {
		userId: User['id']
		entityId: IArtboardVersion['id']
		type: designTypeEnum
		designOverrides: IDesignCreateOverrides
	}) {
		const data = ArtboardDesignDataCreateSchema.parse({
			type,
			ownerId: userId,
			artboardVersionId: entityId,
			...designOverrides,
		})
		return await prisma.design.create({ data })
	}

	async visibleDesignsByTypeCount({
		entityId,
		type,
	}: {
		entityId: IArtboardVersion['id']
		type: designTypeEnum
	}) {
		const visibleDesignsByTypeCount = await prisma.design.count({
			where: { artboardVersionId: entityId, type, visible: true },
		})
		return Number(visibleDesignsByTypeCount)
	}
}

export const artboardVersionDesignCreateService = async ({
	userId,
	artboardVersionId,
	type,
	designOverrides = {},
	designTypeOverrides = {},
}: {
	userId: User['id']
	artboardVersionId: IArtboardVersion['id']
	type: designTypeEnum
	designOverrides?: IDesignCreateOverrides
	designTypeOverrides?: IDesignTypeCreateOverrides
}) => {
	try {
		const strategy = new ArtboardVersionCreateDesignStrategy()
		const updateSelectedDesignStrategy =
			new ArtboardVersionUpdateSelectedDesignStrategy()
		return designCreateService({
			userId,
			entityId: artboardVersionId,
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
