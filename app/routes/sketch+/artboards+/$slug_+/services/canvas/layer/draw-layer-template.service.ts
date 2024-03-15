import { type IArtboardLayerBuild } from '../../../queries'

export const canvasDrawLayerTemplateService = ({
	layer,
}: {
	layer: IArtboardLayerBuild
}) => {
	const { template } = layer
	const { style } = template

	return style
}
