import { type IArtboardLayerBuild } from '../../../queries'

export const canvasDrawLayerLineService = ({
	layer,
}: {
	layer: IArtboardLayerBuild
}) => {
	const { line } = layer
	const { width } = line

	return width
}
