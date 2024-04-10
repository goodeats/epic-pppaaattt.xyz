import {
	deselectLayerSelectedDesign,
	findFirstVisibleLayerDesignByType,
	updateLayerSelectedDesign,
} from '#app/models/design-layer.server'
import { type IDesign } from '#app/models/design.server'
import { type ILayer } from '#app/models/layer.server'
import { type designTypeEnum } from '#app/schema/design'
import { prisma } from '#app/utils/db.server'
import { type IUpdateSelectedDesignStrategy } from '../../design/update-selected.service'

export class LayerUpdateSelectedDesignStrategy
	implements IUpdateSelectedDesignStrategy
{
	async updateSelectedDesign({
		entityId,
		designId,
		type,
	}: {
		entityId: ILayer['id']
		designId: IDesign['id']
		type: designTypeEnum
	}) {
		const updateSelectedDesignPromise = updateLayerSelectedDesign({
			layerId: entityId,
			designId,
			type,
		})
		await prisma.$transaction(updateSelectedDesignPromise)
	}

	async findFirstVisibleDesign({
		entityId,
		type,
	}: {
		entityId: ILayer['id']
		type: designTypeEnum
	}) {
		return await findFirstVisibleLayerDesignByType({
			layerId: entityId,
			type,
		})
	}

	async deselectDesign({
		entityId,
		type,
	}: {
		entityId: ILayer['id']
		type: designTypeEnum
	}) {
		const deselectDesignsPromise = deselectLayerSelectedDesign({
			layerId: entityId,
			type,
		})
		await prisma.$transaction([deselectDesignsPromise])
	}
}
