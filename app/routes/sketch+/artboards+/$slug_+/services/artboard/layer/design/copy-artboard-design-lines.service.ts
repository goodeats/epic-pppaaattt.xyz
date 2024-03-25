import { type Layer, type User } from '@prisma/client'
import {
	type IDesignWithLine,
	type IDesignCreateOverrides,
} from '#app/models/design.server'
import { type ILineCreateOverrides } from '#app/models/line.server'
import { DesignTypeEnum } from '#app/schema/design'
import { layerDesignCreateService } from '../../../layer/design/create.service'

export const artboardLayerCopyArtboardDesignLinesService = async ({
	userId,
	layer,
	designs,
}: {
	userId: User['id']
	layer: Layer
	designs: IDesignWithLine[]
}) => {
	const type = DesignTypeEnum.LINE
	let visibleDesignsCount = 0

	// loop artboard designs
	for (let i = 0; i < designs.length; i++) {
		const design = designs[i]
		const { visible, selected, line } = design as IDesignWithLine

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

		// set design line overrides
		const { width } = line
		const designLineOverrides = {
			width,
		} as ILineCreateOverrides

		// create design line
		await layerDesignCreateService({
			userId,
			layerId: layer.id,
			type,
			designOverrides,
			designTypeOverrides: designLineOverrides,
		})
	}
}
