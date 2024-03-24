import { type Layer, type User } from '@prisma/client'
import {
	type IDesignCreateOverrides,
	type IDesignWithPalette,
} from '#app/models/design.server'
import { type IPaletteCreateOverrides } from '#app/models/palette.server'
import { DesignTypeEnum } from '#app/schema/design'
import { layerDesignCreateService } from '../../../layer/design/create.service'

export const artboardLayerCopyArtboardDesignPalettesService = async ({
	userId,
	layer,
	designs,
}: {
	userId: User['id']
	layer: Layer
	designs: IDesignWithPalette[]
}) => {
	const type = DesignTypeEnum.PALETTE
	let visibleDesignsCount = 0

	// loop artboard designs
	for (let i = 0; i < designs.length; i++) {
		const design = designs[i]
		const { visible, selected, palette } = design as IDesignWithPalette

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

		// set design palette overrides
		const { format, value, opacity } = palette
		const designPaletteOverrides = {
			format,
			value,
			opacity,
		} as IPaletteCreateOverrides

		// create design palette
		await layerDesignCreateService({
			userId,
			layerId: layer.id,
			type,
			designOverrides,
			designTypeOverrides: designPaletteOverrides,
		})
	}
}
