import { type IArtboardVersion } from '#app/models/artboard-version.server'
import {
	deselectArtboardVersionSelectedDesign,
	findFirstVisibleArtboardVersionDesignByType,
	updateArtboardVersionSelectedDesign,
} from '#app/models/design-artboard-version.server'
import { type IDesign } from '#app/models/design.server'
import { type designTypeEnum } from '#app/schema/design'
import { prisma } from '#app/utils/db.server'
import { type IUpdateSelectedDesignStrategy } from '../../../design/update-selected.service'

export class ArtboardVersionUpdateSelectedDesignStrategy
	implements IUpdateSelectedDesignStrategy
{
	async updateSelectedDesign({
		entityId,
		designId,
		type,
	}: {
		entityId: IArtboardVersion['id']
		designId: IDesign['id']
		type: designTypeEnum
	}) {
		const updateSelectedDesignPromise = updateArtboardVersionSelectedDesign({
			artboardVersionId: entityId,
			designId,
			type,
		})
		await prisma.$transaction(updateSelectedDesignPromise)
	}

	async findFirstVisibleDesign({
		entityId,
		type,
	}: {
		entityId: IArtboardVersion['id']
		type: designTypeEnum
	}) {
		return await findFirstVisibleArtboardVersionDesignByType({
			artboardVersionId: entityId,
			type,
		})
	}

	async deselectDesign({
		entityId,
		type,
	}: {
		entityId: IArtboardVersion['id']
		type: designTypeEnum
	}) {
		const deselectDesignsPromise = deselectArtboardVersionSelectedDesign({
			artboardVersionId: entityId,
			type,
		})
		await prisma.$transaction([deselectDesignsPromise])
	}
}
