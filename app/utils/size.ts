import { type ILayerGeneratorContainer } from '#app/definitions/artboard-generator'
import { type ISize } from '#app/models/design-type/size/size.server'
import { SizeBasisTypeEnum } from '#app/schema/size'

export const sizePercentToPixel = ({
	size,
	container,
}: {
	size: ISize
	container: ILayerGeneratorContainer
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
