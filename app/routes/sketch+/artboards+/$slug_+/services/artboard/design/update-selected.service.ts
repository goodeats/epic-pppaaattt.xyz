import {
	findFirstVisibleArtboardDesign,
	updateArtboardSelectedDesign,
} from '#app/models/design-artboard.server'
import { type IDesign } from '#app/models/design.server'
import { type designTypeEnum } from '#app/schema/design'
import { type IArtboard, prisma } from '#app/utils/db.server'

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
		if (designId) {
			const updateSelectedDesignPromise = updateArtboardSelectedDesign({
				artboardId,
				designId,
				type,
			})
			await prisma.$transaction(updateSelectedDesignPromise)
		} else {
			const firstVisibleDesign = await findFirstVisibleArtboardDesign({
				artboardId,
				type,
			})

			if (firstVisibleDesign) {
				const updateSelectedDesignPromise = updateArtboardSelectedDesign({
					artboardId,
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
