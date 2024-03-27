import { type IArtboardLayerBuild } from '../../../../queries'

export const canvasBuildLayerDrawTemplateService = ({
	layer,
	index,
}: {
	layer: IArtboardLayerBuild
	index: number
}) => {
	const { template } = layer
	const { style } = template

	return style
}
