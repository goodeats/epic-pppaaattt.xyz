import { type IArtboardLayerBuild } from '../../../queries'

export const canvasDrawLayerStrokeService = ({
	layer,
}: {
	layer: IArtboardLayerBuild
}) => {
	const { stroke } = layer
	const { basis, value } = stroke

	if (basis === 'defined') {
		return value
	}

	return '000000'
}
