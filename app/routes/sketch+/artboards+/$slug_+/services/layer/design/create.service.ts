import { type User } from '@prisma/client'
import {
	type IDesignCreateOverrides,
	findFirstDesign,
	type IDesignTypeCreateOverrides,
} from '#app/models/design.server'
import { type ILayer } from '#app/models/layer.server'
import { type designTypeEnum } from '#app/schema/design'
import { LayerDesignDataCreateSchema } from '#app/schema/design-layer'
import { prisma } from '#app/utils/db.server'
import {
	designCreateService,
	type ICreateDesignStrategy,
} from '../../design/create.service'
import { LayerUpdateSelectedDesignStrategy } from './update-selected.service'

export class LayerCreateDesignStrategy implements ICreateDesignStrategy {
	async getDesignsByTypeTail({
		entityId,
		type,
	}: {
		entityId: ILayer['id']
		type: designTypeEnum
	}) {
		return await findFirstDesign({
			where: { type, layerId: entityId, nextId: null },
		})
	}

	async createDesign({
		userId,
		entityId,
		type,
		designOverrides,
	}: {
		userId: User['id']
		entityId: ILayer['id']
		type: designTypeEnum
		designOverrides: IDesignCreateOverrides
	}) {
		const data = LayerDesignDataCreateSchema.parse({
			type,
			ownerId: userId,
			layerId: entityId,
			...designOverrides,
		})
		return await prisma.design.create({ data })
	}

	async visibleDesignsByTypeCount({
		entityId,
		type,
	}: {
		entityId: ILayer['id']
		type: designTypeEnum
	}) {
		const visibleLayerDesignsByTypeCount = await prisma.design.count({
			where: { layerId: entityId, type, visible: true },
		})
		return Number(visibleLayerDesignsByTypeCount)
	}
}

export const layerDesignCreateService = async ({
	userId,
	layerId,
	type,
	designOverrides = {},
	designTypeOverrides = {},
}: {
	userId: User['id']
	layerId: ILayer['id']
	type: designTypeEnum
	designOverrides?: IDesignCreateOverrides
	designTypeOverrides?: IDesignTypeCreateOverrides
}) => {
	try {
		const strategy = new LayerCreateDesignStrategy()
		const updateSelectedDesignStrategy = new LayerUpdateSelectedDesignStrategy()
		return designCreateService({
			userId,
			entityId: layerId,
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
