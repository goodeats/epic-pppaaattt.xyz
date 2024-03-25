import { type Layer, type User } from '@prisma/client'
import {
	type IDesignWithFill,
	type IDesignCreateOverrides,
} from '#app/models/design.server'
import { type IFillCreateOverrides } from '#app/models/fill.server'
import { DesignTypeEnum } from '#app/schema/design'
import { layerDesignCreateService } from '../../../layer/design/create.service'

export const artboardLayerCopyArtboardDesignFillsService = async ({
	userId,
	layer,
	designs,
}: {
	userId: User['id']
	layer: Layer
	designs: IDesignWithFill[]
}) => {
	const type = DesignTypeEnum.FILL
	let visibleDesignsCount = 0

	// loop artboard designs
	for (let i = 0; i < designs.length; i++) {
		const design = designs[i]
		const { visible, selected, fill } = design as IDesignWithFill

		// set design overrides
		const selectedByVisibility = visible && visibleDesignsCount === 0
		const designOverrides = {
			visible,
			selected: selected || selectedByVisibility,
		} as IDesignCreateOverrides

		// add to visible designs count
		if (visible) {
			visibleDesignsCount++
		}

		// set design fill overrides
		const { style, value, basis } = fill
		const designFillOverrides = {
			style,
			value,
			basis,
		} as IFillCreateOverrides

		// create design fill
		await layerDesignCreateService({
			userId,
			layerId: layer.id,
			type,
			designOverrides,
			designTypeOverrides: designFillOverrides,
		})
	}
}
