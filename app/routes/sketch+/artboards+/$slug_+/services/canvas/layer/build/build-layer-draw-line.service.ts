import { type IArtboardLayerBuild } from '../../../../queries'

export const canvasBuildLayerDrawLineService = ({
	layer,
}: {
	layer: IArtboardLayerBuild
}) => {
	const { line } = layer
	const { width } = line

	return width
}
