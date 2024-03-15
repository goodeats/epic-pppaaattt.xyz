import { type IArtboardLayerBuild } from '../../../../queries'

export const canvasBuildLayerDrawTemplateService = ({
	layer,
}: {
	layer: IArtboardLayerBuild
}) => {
	const { template } = layer
	const { style } = template

	return style
}
