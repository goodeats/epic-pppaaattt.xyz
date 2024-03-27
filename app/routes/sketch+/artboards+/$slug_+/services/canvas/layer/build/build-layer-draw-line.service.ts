import { type ISize } from '#app/models/size.server'
import { LineBasisTypeEnum, LineFormatTypeEnum } from '#app/schema/line'
import { SizeBasisTypeEnum } from '#app/schema/size'
import {
	type IArtboardLayerContainerBuild,
	type IArtboardLayerBuild,
} from '../../../../queries'

// FYI line width affects the size of the template
// come back to this when grid is ready
// for making sure my adjustments are more precise

export const canvasBuildLayerDrawLineService = ({
	layer,
	index,
}: {
	layer: IArtboardLayerBuild
	index: number
}) => {
	const { line, size, container } = layer
	const { width, basis, format } = line

	if (format === LineFormatTypeEnum.PERCENT) {
		const linePercent = width / 100

		switch (basis) {
			case LineBasisTypeEnum.SIZE:
				const sizeValue = sizePercentToPixel({ size, container })
				return sizeValue * linePercent
			case LineBasisTypeEnum.WIDTH:
				return container.width * linePercent
			case LineBasisTypeEnum.HEIGHT:
				return container.height * linePercent
			case LineBasisTypeEnum.CANVAS_WIDTH:
				return container.canvas.width * linePercent
			case LineBasisTypeEnum.CANVAS_HEIGHT:
				return container.canvas.height * linePercent
			default:
				return 0
		}
	}

	return width
}

const sizePercentToPixel = ({
	size,
	container,
}: {
	size: ISize
	container: IArtboardLayerContainerBuild
}) => {
	const { basis, value } = size
	const sizePercent = value / 100

	switch (basis) {
		case SizeBasisTypeEnum.WIDTH:
			return container.width * sizePercent
		case SizeBasisTypeEnum.HEIGHT:
			return container.height * sizePercent
		case SizeBasisTypeEnum.CANVAS_WIDTH:
			return container.canvas.width * sizePercent
		case SizeBasisTypeEnum.CANVAS_HEIGHT:
			return container.canvas.height * sizePercent
		default:
			// something went wrong
			return 0
	}
}
