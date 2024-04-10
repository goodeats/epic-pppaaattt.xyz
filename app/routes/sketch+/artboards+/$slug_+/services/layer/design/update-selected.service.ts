import {
	deselectLayerSelectedDesign,
	findFirstVisibleLayerDesign,
	updateLayerSelectedDesign,
} from '#app/models/design-layer.server'
import { type IDesign } from '#app/models/design.server'
import { type ILayer } from '#app/models/layer.server'
import { type designTypeEnum } from '#app/schema/design'
import { prisma } from '#app/utils/db.server'

export const layerUpdateSelectedDesignService = async ({
	layerId,
	designId,
	type,
}: {
	layerId: ILayer['id']
	designId?: IDesign['id'] | null
	type: designTypeEnum
}) => {
	try {
		// if design is specified,
		// update the selected design
		if (designId) {
			const updateSelectedDesignPromise = updateLayerSelectedDesign({
				layerId,
				designId,
				type,
			})
			await prisma.$transaction(updateSelectedDesignPromise)
		} else {
			// if design is not specified,
			// find the first visible design by type
			const firstVisibleDesign = await findFirstVisibleLayerDesign({
				layerId,
				type,
			})

			// if first visible design by type is found,
			// update the selected design
			if (firstVisibleDesign) {
				const updateSelectedDesignPromise = updateLayerSelectedDesign({
					layerId,
					designId: firstVisibleDesign.id,
					type,
				})
				await prisma.$transaction(updateSelectedDesignPromise)
			} else {
				console.log('deselecting')
				// if first visible design by type is not found,
				// that means there is no design to select
				// so deselect the selected design
				const deselectDesignsPromise = deselectLayerSelectedDesign({
					layerId,
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
