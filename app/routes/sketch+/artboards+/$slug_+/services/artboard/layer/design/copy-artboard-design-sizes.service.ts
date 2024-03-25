import { type Layer, type User } from '@prisma/client'
import {
	type IDesignWithSize,
	type IDesignCreateOverrides,
} from '#app/models/design.server'
import { type ISizeCreateOverrides } from '#app/models/size.server'
import { DesignTypeEnum } from '#app/schema/design'
import { layerDesignCreateService } from '../../../layer/design/create.service'

export const artboardLayerCopyArtboardDesignSizesService = async ({
	userId,
	layer,
	designs,
}: {
	userId: User['id']
	layer: Layer
	designs: IDesignWithSize[]
}) => {
	const type = DesignTypeEnum.SIZE
	let visibleDesignsCount = 0

	// loop artboard designs
	for (let i = 0; i < designs.length; i++) {
		const design = designs[i]
		const { visible, selected, size } = design as IDesignWithSize

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

		// set design size overrides
		const { format, value, basis } = size
		const designSizeOverrides = {
			format,
			value,
			basis,
		} as ISizeCreateOverrides

		// create design size
		await layerDesignCreateService({
			userId,
			layerId: layer.id,
			type,
			designOverrides,
			designTypeOverrides: designSizeOverrides,
		})
	}
}
