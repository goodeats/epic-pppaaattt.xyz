import { type Layer, type User } from '@prisma/client'
import {
	type IDesignWithStroke,
	type IDesignCreateOverrides,
} from '#app/models/design.server'
import { type IStrokeCreateOverrides } from '#app/models/stroke.server'
import { DesignTypeEnum } from '#app/schema/design'
import { layerDesignCreateService } from '../../../layer/design/create.service'

export const artboardLayerCopyArtboardDesignStrokesService = async ({
	userId,
	layer,
	designs,
}: {
	userId: User['id']
	layer: Layer
	designs: IDesignWithStroke[]
}) => {
	const type = DesignTypeEnum.STROKE
	let visibleDesignsCount = 0

	// loop artboard designs
	for (let i = 0; i < designs.length; i++) {
		const design = designs[i]
		const { visible, selected, stroke } = design as IDesignWithStroke

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

		// set design stroke overrides
		const { style, value, basis } = stroke
		const designStrokeOverrides = {
			style,
			value,
			basis,
		} as IStrokeCreateOverrides

		// create design stroke
		await layerDesignCreateService({
			userId,
			layerId: layer.id,
			type,
			designOverrides,
			designTypeOverrides: designStrokeOverrides,
		})
	}
}
