import { type Layer, type User } from '@prisma/client'
import {
	type IDesignWithLayout,
	type IDesignCreateOverrides,
} from '#app/models/design.server'
import { type ILayoutCreateOverrides } from '#app/models/layout.server'
import { DesignTypeEnum } from '#app/schema/design'
import { layerDesignCreateService } from '../../../layer/design/create.service'

export const artboardLayerCopyArtboardDesignLayoutsService = async ({
	userId,
	layer,
	designs,
}: {
	userId: User['id']
	layer: Layer
	designs: IDesignWithLayout[]
}) => {
	const type = DesignTypeEnum.LAYOUT
	let visibleDesignsCount = 0

	// loop artboard designs
	for (let i = 0; i < designs.length; i++) {
		const design = designs[i]
		const { visible, selected, layout } = design as IDesignWithLayout

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

		// set design layout overrides
		const { style, count, rows, columns } = layout
		const designLayoutOverrides = {
			style,
			count,
			rows,
			columns,
		} as ILayoutCreateOverrides

		// create design layout
		await layerDesignCreateService({
			userId,
			layerId: layer.id,
			type,
			designOverrides,
			designTypeOverrides: designLayoutOverrides,
		})
	}
}
