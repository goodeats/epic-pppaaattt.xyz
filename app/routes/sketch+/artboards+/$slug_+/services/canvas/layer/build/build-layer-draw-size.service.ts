import { type ISize } from '#app/models/size.server'
import { SizeBasisTypeEnum, SizeFormatTypeEnum } from '#app/schema/size'
import {
	type IArtboardLayerContainerBuild,
	type IArtboardLayerBuild,
} from '../../../../queries'

export const canvasBuildLayerDrawSizeService = ({
	layer,
}: {
	layer: IArtboardLayerBuild
}) => {
	const { size, container } = layer
	const { value, format } = size

	if (format === SizeFormatTypeEnum.PERCENT) {
		return sizePercentToPixel({ size, container })
	}

	// pixel value
	return value
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
