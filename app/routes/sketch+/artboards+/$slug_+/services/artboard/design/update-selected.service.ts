import { type IArtboard } from '#app/models/artboard.server'
import {
	deselectArtboardSelectedDesign,
	findFirstVisibleArtboardDesignByType,
	updateArtboardSelectedDesign,
} from '#app/models/design-artboard.server'
import { type IDesign } from '#app/models/design.server'
import { type designTypeEnum } from '#app/schema/design'
import { prisma } from '#app/utils/db.server'
import { type IUpdateSelectedDesignStrategy } from '../../design/update-selected.service'

export class ArtboardUpdateSelectedDesignStrategy
	implements IUpdateSelectedDesignStrategy
{
	async updateSelectedDesign({
		entityId,
		designId,
		type,
	}: {
		entityId: IArtboard['id']
		designId: IDesign['id']
		type: designTypeEnum
	}) {
		const updateSelectedDesignPromise = updateArtboardSelectedDesign({
			artboardId: entityId,
			designId,
			type,
		})
		await prisma.$transaction(updateSelectedDesignPromise)
	}

	async findFirstVisibleDesign({
		entityId,
		type,
	}: {
		entityId: IArtboard['id']
		type: designTypeEnum
	}) {
		return await findFirstVisibleArtboardDesignByType({
			artboardId: entityId,
			type,
		})
	}

	async deselectDesign({
		entityId,
		type,
	}: {
		entityId: IArtboard['id']
		type: designTypeEnum
	}) {
		const deselectDesignsPromise = deselectArtboardSelectedDesign({
			artboardId: entityId,
			type,
		})
		await prisma.$transaction([deselectDesignsPromise])
	}
}
