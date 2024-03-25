import { type Layer, type User } from '@prisma/client'
import {
	type IDesignWithRotate,
	type IDesignCreateOverrides,
} from '#app/models/design.server'
import { type IRotateCreateOverrides } from '#app/models/rotate.server'
import { DesignTypeEnum } from '#app/schema/design'
import { layerDesignCreateService } from '../../../layer/design/create.service'

export const artboardLayerCopyArtboardDesignRotatesService = async ({
	userId,
	layer,
	designs,
}: {
	userId: User['id']
	layer: Layer
	designs: IDesignWithRotate[]
}) => {
	const type = DesignTypeEnum.ROTATE
	let visibleDesignsCount = 0

	// loop artboard designs
	for (let i = 0; i < designs.length; i++) {
		const design = designs[i]
		const { visible, selected, rotate } = design as IDesignWithRotate

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

		// set design rotate overrides
		const { rotation, basis } = rotate
		const designRotateOverrides = {
			rotation,
			basis,
		} as IRotateCreateOverrides

		// create design rotate
		await layerDesignCreateService({
			userId,
			layerId: layer.id,
			type,
			designOverrides,
			designTypeOverrides: designRotateOverrides,
		})
	}
}
