import { type ILayerGenerator } from '#app/definitions/artwork-generator'

export const canvasBuildLayerDrawTemplateService = ({
	layer,
	index,
}: {
	layer: ILayerGenerator
	index: number
}) => {
	const { template } = layer
	const { style } = template

	return style
}
