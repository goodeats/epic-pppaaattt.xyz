import { type User } from '@prisma/client'
import {
	type IDesignEntityId,
	type IDesignCreateOverrides,
	type IDesignWithType,
} from '#app/models/design/design.server'
import { type ICloneDesignsStrategy } from '#app/strategies/design/clone.strategy'
import { type ICloneDesignTypeStrategy } from '#app/strategies/design-type/clone.strategy'

export const cloneDesignTypesService = async ({
	userId,
	targetEntityId,
	designs,
	strategy,
	entityStrategy,
}: {
	userId: User['id']
	targetEntityId: IDesignEntityId
	designs: IDesignWithType[]
	strategy: ICloneDesignTypeStrategy
	entityStrategy: ICloneDesignsStrategy
}) => {
	// Step 1: start visible designs count at 0
	let visibleDesignsCount = 0

	// Step 2: loop entity design types
	// kinda weird way to set the loop up, but it works
	for (const [, design] of designs.entries()) {
		const { visible, selected } = design as IDesignWithType

		// Step 3: set design overrides
		// if first visible design is not "selected" somehow,
		// then set it to "selected" to avoid having no selected designs
		// it's possible this was a temporary fix for a bug, but it works!
		const selectedByVisibility = visible && visibleDesignsCount === 0
		const designOverrides = {
			visible,
			selected: selected || selectedByVisibility,
		} as IDesignCreateOverrides

		// Step 4: add to visible designs count so next visible design will not be "selected"
		if (visible) {
			visibleDesignsCount++
		}

		// Step 5: set design type overrides
		// when cloning it, is likely the designs no longer have the default values
		const designTypeOverrides = strategy.getDesignTypeOverrides({
			design,
		})

		// Step 6: create design type
		await entityStrategy.createEntityDesignService({
			userId,
			targetEntityId,
			type: strategy.type,
			designOverrides,
			designTypeOverrides,
		})
	}
}
