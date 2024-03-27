import { LineFormatTypeEnum } from '#app/schema/line'
import { linePercentToPixel } from '#app/utils/line'
import { type IArtboardLayerBuild } from '../../../../queries'

export const canvasBuildLayerDrawLineService = ({
	layer,
	index,
}: {
	layer: IArtboardLayerBuild
	index: number
}) => {
	const { line, size, container } = layer
	const { width, format } = line

	if (format === LineFormatTypeEnum.PERCENT) {
		return linePercentToPixel({ line, size, container })
	}

	return width
}
