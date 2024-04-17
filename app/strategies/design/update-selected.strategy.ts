import { type IArtboardVersion } from '#app/models/artboard-version/artboard-version.server'
import { type IArtboard } from '#app/models/artboard.server'
import {
	deselectArtboardVersionSelectedDesign,
	findFirstVisibleArtboardVersionDesignByType,
	updateArtboardVersionSelectedDesign,
} from '#app/models/design-artboard-version.server'
import {
	deselectArtboardSelectedDesign,
	findFirstVisibleArtboardDesignByType,
	updateArtboardSelectedDesign,
} from '#app/models/design-artboard.server'
import {
	deselectLayerSelectedDesign,
	findFirstVisibleLayerDesignByType,
	updateLayerSelectedDesign,
} from '#app/models/design-layer.server'
import {
	type IDesign,
	type IDesignEntityId,
	type IDesignIdOrNull,
} from '#app/models/design.server'
import { type ILayer } from '#app/models/layer.server'
import { type designTypeEnum } from '#app/schema/design'
import { prisma } from '#app/utils/db.server'

export interface IUpdateSelectedDesignStrategy {
	updateSelectedDesign(args: {
		targetEntityId: IDesignEntityId
		designId?: IDesignIdOrNull
		type: designTypeEnum
	}): Promise<void>
	findFirstVisibleDesign(args: {
		targetEntityId: IDesignEntityId
		type: designTypeEnum
	}): Promise<IDesign | null>
	deselectDesign(args: {
		targetEntityId: IDesignEntityId
		type: designTypeEnum
	}): Promise<void>
}

export class LayerUpdateSelectedDesignStrategy
	implements IUpdateSelectedDesignStrategy
{
	async updateSelectedDesign({
		targetEntityId,
		designId,
		type,
	}: {
		targetEntityId: ILayer['id']
		designId: IDesign['id']
		type: designTypeEnum
	}) {
		const updateSelectedDesignPromise = updateLayerSelectedDesign({
			layerId: targetEntityId,
			designId,
			type,
		})
		await prisma.$transaction(updateSelectedDesignPromise)
	}

	async findFirstVisibleDesign({
		targetEntityId,
		type,
	}: {
		targetEntityId: ILayer['id']
		type: designTypeEnum
	}) {
		return await findFirstVisibleLayerDesignByType({
			layerId: targetEntityId,
			type,
		})
	}

	async deselectDesign({
		targetEntityId,
		type,
	}: {
		targetEntityId: ILayer['id']
		type: designTypeEnum
	}) {
		const deselectDesignsPromise = deselectLayerSelectedDesign({
			layerId: targetEntityId,
			type,
		})
		await prisma.$transaction([deselectDesignsPromise])
	}
}

export class ArtboardVersionUpdateSelectedDesignStrategy
	implements IUpdateSelectedDesignStrategy
{
	async updateSelectedDesign({
		targetEntityId,
		designId,
		type,
	}: {
		targetEntityId: IArtboardVersion['id']
		designId: IDesign['id']
		type: designTypeEnum
	}) {
		const updateSelectedDesignPromise = updateArtboardVersionSelectedDesign({
			artboardVersionId: targetEntityId,
			designId,
			type,
		})
		await prisma.$transaction(updateSelectedDesignPromise)
	}

	async findFirstVisibleDesign({
		targetEntityId,
		type,
	}: {
		targetEntityId: IArtboardVersion['id']
		type: designTypeEnum
	}) {
		return await findFirstVisibleArtboardVersionDesignByType({
			artboardVersionId: targetEntityId,
			type,
		})
	}

	async deselectDesign({
		targetEntityId,
		type,
	}: {
		targetEntityId: IArtboardVersion['id']
		type: designTypeEnum
	}) {
		const deselectDesignsPromise = deselectArtboardVersionSelectedDesign({
			artboardVersionId: targetEntityId,
			type,
		})
		await prisma.$transaction([deselectDesignsPromise])
	}
}

export class ArtboardUpdateSelectedDesignStrategy
	implements IUpdateSelectedDesignStrategy
{
	async updateSelectedDesign({
		targetEntityId,
		designId,
		type,
	}: {
		targetEntityId: IArtboard['id']
		designId: IDesign['id']
		type: designTypeEnum
	}) {
		const updateSelectedDesignPromise = updateArtboardSelectedDesign({
			artboardId: targetEntityId,
			designId,
			type,
		})
		await prisma.$transaction(updateSelectedDesignPromise)
	}

	async findFirstVisibleDesign({
		targetEntityId,
		type,
	}: {
		targetEntityId: IArtboard['id']
		type: designTypeEnum
	}) {
		return await findFirstVisibleArtboardDesignByType({
			artboardId: targetEntityId,
			type,
		})
	}

	async deselectDesign({
		targetEntityId,
		type,
	}: {
		targetEntityId: IArtboard['id']
		type: designTypeEnum
	}) {
		const deselectDesignsPromise = deselectArtboardSelectedDesign({
			artboardId: targetEntityId,
			type,
		})
		await prisma.$transaction([deselectDesignsPromise])
	}
}
