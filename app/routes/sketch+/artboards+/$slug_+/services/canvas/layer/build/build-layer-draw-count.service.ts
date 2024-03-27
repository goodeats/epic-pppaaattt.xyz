import { LayoutStyleTypeEnum } from '#app/schema/layout'
import { type IArtboardLayerBuild } from '../../../../queries'

export const canvasBuildLayerDrawCountService = ({
	layer,
}: {
	layer: IArtboardLayerBuild
}) => {
	const { layout } = layer
	const { style, count, rows, columns } = layout

	if (style === LayoutStyleTypeEnum.GRID) {
		return rows * columns
	}

	// LayoutStyleTypeEnum.RANDOM
	return count
}
