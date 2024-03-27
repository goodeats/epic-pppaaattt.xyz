import { LineFormatTypeEnum } from '#app/schema/line'
import { SizeFormatTypeEnum } from '#app/schema/size'
import {
	calculateMiterStickOutLength,
	linePercentToPixel,
} from '#app/utils/line'
import { sizePercentToPixel } from '#app/utils/size'
import { type IArtboardLayerBuild } from '../../../../queries'

export const canvasBuildLayerDrawSizeService = ({
	layer,
	index,
}: {
	layer: IArtboardLayerBuild
	index: number
}) => {
	const { size, line, container } = layer
	const { value, format } = size

	// const adjLineSize = linePercentToPixel({ line, size, container })
	const adjLineSize = getAdjustedLineSize({ line, size, container })
	console.log(adjLineSize)

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
	line: IArtboardLayerBuild['line']
	size: IArtboardLayerBuild['size']
	container: IArtboardLayerBuild['container']
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
