import { type ILayerGenerator } from '#app/definitions/artwork-generator'
import { linePercentToPixel } from '#app/models/design/line/utils'
import { LineFormatTypeEnum } from '#app/schema/line'

export const canvasBuildLayerDrawLineService = ({
	layer,
	index,
}: {
	layer: ILayerGenerator
	index: number
}) => {
	const { line, size, container } = layer
	const { width, format } = line.attributes

	if (format === LineFormatTypeEnum.PERCENT) {
		return linePercentToPixel({ line, size, container })
	}

	return width
}
