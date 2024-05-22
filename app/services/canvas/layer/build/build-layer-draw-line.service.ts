import { type ILayerGenerator } from '#app/definitions/artwork-generator'
import { LineFormatTypeEnum } from '#app/schema/line'
import { linePercentToPixel } from '#app/utils/line'

export const canvasBuildLayerDrawLineService = ({
	layer,
	index,
}: {
	layer: ILayerGenerator
	index: number
}) => {
	const { line, size, container } = layer
	const { width, format } = line

	if (format === LineFormatTypeEnum.PERCENT) {
		return linePercentToPixel({ line, size, container })
	}

	return width
}
