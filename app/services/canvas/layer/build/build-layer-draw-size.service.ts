import { type ILayerGenerator } from '#app/definitions/artboard-generator'
import { LineFormatTypeEnum } from '#app/schema/line'
import { SizeFormatTypeEnum } from '#app/schema/size'
import {
	calculateMiterStickOutLength,
	linePercentToPixel,
} from '#app/utils/line'
import { sizePercentToPixel } from '#app/utils/size'

export const canvasBuildLayerDrawSizeService = ({
	layer,
	index,
}: {
	layer: ILayerGenerator
	index: number
}) => {
	const { size, line, container } = layer
	const { value, format } = size

	// const adjLineSize = linePercentToPixel({ line, size, container })
	const adjLineSize = getAdjustedLineSize({ line, size, container })

	if (format === SizeFormatTypeEnum.PERCENT) {
		return sizePercentToPixel({ size, container }) - adjLineSize
	}

	// pixel value
	return value - adjLineSize
}

// adjust for line width
// and miter stick out length
// https://www.w3schools.com/jsref/canvas_miterlimit.asp (good diagrams at least)
const getAdjustedLineSize = ({
	line,
	size,
	container,
}: {
	line: ILayerGenerator['line']
	size: ILayerGenerator['size']
	container: ILayerGenerator['container']
}) => {
	const { width, format } = line

	const formatPercent = format === LineFormatTypeEnum.PERCENT
	const lineWidth = formatPercent
		? linePercentToPixel({ line, size, container })
		: width

	const miterStickOutLength = calculateMiterStickOutLength({
		lineWidth,
		angle: 60,
	})

	return lineWidth / 2 + miterStickOutLength * 2
}
