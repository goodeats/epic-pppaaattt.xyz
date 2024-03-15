import { type IArtboardLayerBuild } from '../../../../queries'

export const canvasBuildLayerDrawFillService = ({
	layer,
}: {
	layer: IArtboardLayerBuild
}) => {
	const { fill } = layer
	const { basis, value } = fill

	if (basis === 'defined') {
		return value
	}

	return '000000'
}
