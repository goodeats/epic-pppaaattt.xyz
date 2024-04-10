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
		console.log('updateSelectedDesignPromise')
		await prisma.$transaction(updateSelectedDesignPromise)
	}

	async findFirstVisibleDesign({
		entityId,
		type,
	}: {
		entityId: IArtboard['id']
		type: designTypeEnum
	}) {
		console.log('findFirstVisibleLayerDesign')
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
		console.log('deselectDesignsPromise')
		await prisma.$transaction([deselectDesignsPromise])
	}
}

export const artboardUpdateSelectedDesignService = async ({
	artboardId,
	designId,
	type,
}: {
	artboardId: IArtboard['id']
	designId?: IDesign['id'] | null
	type: designTypeEnum
}) => {
	try {
		// if design is specified,
		// update the selected design
		if (designId) {
			const updateSelectedDesignPromise = updateArtboardSelectedDesign({
				artboardId,
				designId,
				type,
			})
			await prisma.$transaction(updateSelectedDesignPromise)
		} else {
			// if design is not specified,
			// find the first visible design by type
			const firstVisibleDesignByType =
				await findFirstVisibleArtboardDesignByType({
					artboardId,
					type,
				})

			// if first visible design by type is found,
			// update the selected design
			if (firstVisibleDesignByType) {
				const updateSelectedDesignPromise = updateArtboardSelectedDesign({
					artboardId,
					designId: firstVisibleDesignByType.id,
					type,
				})
				await prisma.$transaction(updateSelectedDesignPromise)
			} else {
				// if first visible design by type is not found,
				// that means there is no design to select
				// so deselect the selected design
				const deselectDesignsPromise = deselectArtboardSelectedDesign({
					artboardId,
					type,
				})
				await prisma.$transaction([deselectDesignsPromise])
			}
		}

		return { success: true }
	} catch (error) {
		console.log(error)
		return { error: true }
	}
}
