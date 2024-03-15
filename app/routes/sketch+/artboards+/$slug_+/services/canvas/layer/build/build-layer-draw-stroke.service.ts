import { type IArtboardLayerBuild } from '../../../../queries'

export const canvasBuildLayerDrawStrokeService = ({
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
