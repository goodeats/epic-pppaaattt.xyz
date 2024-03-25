import { findFirstVisibleLayerDesign } from '#app/models/design-layer.server'
import {
	updateLayerSelectedDesign,
	type IDesign,
} from '#app/models/design.server'
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
		if (designId) {
			const updateSelectedDesignPromise = updateLayerSelectedDesign({
				layerId,
				designId,
				type,
			})
			await prisma.$transaction(updateSelectedDesignPromise)
		} else {
			const firstVisibleDesign = await findFirstVisibleLayerDesign({
				layerId,
				type,
			})

			if (firstVisibleDesign) {
				const updateSelectedDesignPromise = updateLayerSelectedDesign({
					layerId,
					designId: firstVisibleDesign.id,
					type,
				})
				await prisma.$transaction(updateSelectedDesignPromise)
			}
		}

		return { success: true }
	} catch (error) {
		console.log(error)
		return { error: true }
	}
}
