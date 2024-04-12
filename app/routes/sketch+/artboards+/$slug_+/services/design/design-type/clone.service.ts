import { type User } from '@prisma/client'
import {
	type IDesignEntityId,
	type IDesignCreateOverrides,
	type IDesignWithType,
	type IDesignTypeCreateOverrides,
	type IDesignsByType,
} from '#app/models/design.server'
import { type designTypeEnum } from '#app/schema/design'
import { type ICloneDesignsStrategy } from '../clone.service'
import { CloneFillDesignStrategy } from './clone/fill.strategy'
import { CloneLayoutDesignStrategy } from './clone/layout.strategy'
import { CloneLineDesignStrategy } from './clone/line.strategy'
import { ClonePaletteDesignStrategy } from './clone/palette.strategy'
import { CloneRotateDesignStrategy } from './clone/rotate.strategy'
import { CloneSizeDesignStrategy } from './clone/size.strategy'
import { CloneStrokeDesignStrategy } from './clone/stroke.strategy'
import { CloneTemplateDesignStrategy } from './clone/template.strategy'

export interface ICloneDesignTypeStrategy {
	type: designTypeEnum
	getDesignTypeOverrides(args: {
		design: IDesignWithType
	}): IDesignTypeCreateOverrides
}

export const designTypeStrategies: {
	[K in keyof IDesignsByType]?: ICloneDesignTypeStrategy
} = {
	designPalettes: new ClonePaletteDesignStrategy(),
	designSizes: new CloneSizeDesignStrategy(),
	designFills: new CloneFillDesignStrategy(),
	designStrokes: new CloneStrokeDesignStrategy(),
	designLines: new CloneLineDesignStrategy(),
	designRotates: new CloneRotateDesignStrategy(),
	designLayouts: new CloneLayoutDesignStrategy(),
	designTemplates: new CloneTemplateDesignStrategy(),
}

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
