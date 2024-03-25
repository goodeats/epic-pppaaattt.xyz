import { type Layer, type User } from '@prisma/client'
import {
	type IDesignCreateOverrides,
	type IDesignWithTemplate,
} from '#app/models/design.server'
import { type ITemplateCreateOverrides } from '#app/models/template.server'
import { DesignTypeEnum } from '#app/schema/design'
import { layerDesignCreateService } from '../../../layer/design/create.service'

export const artboardLayerCopyArtboardDesignTemplatesService = async ({
	userId,
	layer,
	designs,
}: {
	userId: User['id']
	layer: Layer
	designs: IDesignWithTemplate[]
}) => {
	const type = DesignTypeEnum.TEMPLATE
	let visibleDesignsCount = 0

	// loop artboard designs
	for (let i = 0; i < designs.length; i++) {
		const design = designs[i]
		const { visible, selected, template } = design as IDesignWithTemplate

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

		// set design template overrides
		const { style } = template
		const designTemplateOverrides = {
			style,
		} as ITemplateCreateOverrides

		// create design template
		await layerDesignCreateService({
			userId,
			layerId: layer.id,
			type,
			designOverrides,
			designTypeOverrides: designTemplateOverrides,
		})
	}
}
