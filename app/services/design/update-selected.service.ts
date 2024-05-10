import {
	type IDesignEntityId,
	type IDesignIdOrNull,
} from '#app/models/design.server'
import { type designTypeEnum } from '#app/schema/design'
import { type IUpdateSelectedDesignStrategy } from '#app/strategies/design/update-selected.strategy'

export const updateSelectedDesignService = async ({
	targetEntityId,
	designId,
	type,
	strategy,
}: {
	targetEntityId: IDesignEntityId
	designId?: IDesignIdOrNull
	type: designTypeEnum
	strategy: IUpdateSelectedDesignStrategy
}) => {
	try {
		// if design is specified,
		// update the selected design
		if (designId) {
			await strategy.updateSelectedDesign({ targetEntityId, designId, type })
		} else {
			// if design is not specified,
			// find the first visible design by type
			const firstVisibleDesign = await strategy.findFirstVisibleDesign({
				targetEntityId,
				type,
			})

			// if first visible design by type is found,
			// update the selected design
			if (firstVisibleDesign) {
				await strategy.updateSelectedDesign({
					targetEntityId,
					designId: firstVisibleDesign.id,
					type,
				})
			} else {
				// if first visible design by type is not found,
				// that means there is no design to select
				// so deselect the selected design
				await strategy.deselectDesign({ targetEntityId, type })
			}
		}

		return { success: true }
	} catch (error) {
		console.log(error)
		return { error: true }
	}
}
