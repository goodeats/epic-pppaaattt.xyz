import {
	type IDesignEntityId,
	type IDesign,
	type IDesignIdOrNull,
} from '#app/models/design.server'
import { type designTypeEnum } from '#app/schema/design'

export interface IUpdateSelectedDesignStrategy {
	updateSelectedDesign(args: {
		entityId: IDesignEntityId
		designId?: IDesign['id'] | null
		type: designTypeEnum
	}): Promise<void>
	findFirstVisibleDesign(args: {
		entityId: IDesignEntityId
		type: designTypeEnum
	}): Promise<IDesign | null>
	deselectDesign(args: {
		entityId: IDesignEntityId
		type: designTypeEnum
	}): Promise<void>
}

export const updateSelectedDesignService = async ({
	entityId,
	designId,
	type,
	strategy,
}: {
	entityId: IDesignEntityId
	designId?: IDesignIdOrNull
	type: designTypeEnum
	strategy: IUpdateSelectedDesignStrategy
}) => {
	try {
		// if design is specified,
		// update the selected design
		if (designId) {
			await strategy.updateSelectedDesign({ entityId, designId, type })
		} else {
			// if design is not specified,
			// find the first visible design by type
			const firstVisibleDesign = await strategy.findFirstVisibleDesign({
				entityId,
				type,
			})
			// if first visible design by type is found,
			// update the selected design
			if (firstVisibleDesign) {
				await strategy.updateSelectedDesign({
					entityId,
					designId: firstVisibleDesign.id,
					type,
				})
			} else {
				// if first visible design by type is not found,
				// that means there is no design to select
				// so deselect the selected design
				await strategy.deselectDesign({ entityId, type })
			}
		}

		return { success: true }
	} catch (error) {
		console.log(error)
		return { error: true }
	}
}
