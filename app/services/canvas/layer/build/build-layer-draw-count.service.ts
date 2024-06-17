import { type ILayerGenerator } from '#app/definitions/artwork-generator'
import { LayoutStyleTypeEnum } from '#app/schema/layout'

export const canvasBuildLayerDrawCountService = ({
	layer,
}: {
	layer: ILayerGenerator
}) => {
	const { layout } = layer
	const { style, count, rows, columns } = layout.attributes

	if (style === LayoutStyleTypeEnum.GRID) {
		return rows * columns
	}

	// LayoutStyleTypeEnum.RANDOM
	return count
}
