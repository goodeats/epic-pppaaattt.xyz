import { type IArtboardLayerBuild } from '../../../queries'

type sizeBasis = 'width' | 'height'

export const canvasDrawLayerSizeService = ({
	layer,
}: {
	layer: IArtboardLayerBuild
}) => {
	const { size, container } = layer
	const { basis, value, format } = size

	if (format === 'percent') {
		const basisSize = container[basis as sizeBasis]
		return basisSize * (value / 100)
	}

	return value
}
