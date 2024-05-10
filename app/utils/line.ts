import { type ILayerGeneratorContainer } from '#app/definitions/artboard-generator'
import { type ILine } from '#app/models/design-type/line/line.server'
import { type ISize } from '#app/models/design-type/size/size.server'
import { LineBasisTypeEnum } from '#app/schema/line'
import { degreesToRadians } from './rotate'
import { sizePercentToPixel } from './size'

export const linePercentToPixel = ({
	line,
	size,
	container,
}: {
	line: ILine
	size: ISize
	container: ILayerGeneratorContainer
}) => {
	const { width, basis } = line
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

// the miter extends beyond the line by the stroke width
// to account for the miter join, we need to calculate the stick out length
// so we can reduce the size of the line by this amount
export const calculateMiterStickOutLength = ({
	lineWidth,
	angle,
}: {
	lineWidth: number
	angle: number
}) => {
	// convert the base angle to radians
	const baseAngleRadians = degreesToRadians(angle / 2)

	// calculate the miter length
	const miterStickOutLength = lineWidth / 2 / Math.cos(baseAngleRadians)

	return miterStickOutLength
}
