import { colorRandomHex } from '#app/utils/colors'
import { randomIndex } from '#app/utils/random.utils'
import { type IArtboardLayerBuild } from '../../../../queries'

export const canvasBuildLayerDrawStrokeService = ({
	layer,
	pixelHex,
}: {
	layer: IArtboardLayerBuild
	pixelHex: string | null
}) => {
	const { stroke, palette } = layer
	const { basis, value } = stroke

	switch (basis) {
		case 'defined':
			return value
		case 'random':
			return colorRandomHex()
		case 'palette-selected':
			return palette[0].value
		case 'palette-random':
			const index = randomIndex(palette)
			return palette[index].value
		case 'pixel':
			// random to highlight something went wrong
			return pixelHex || colorRandomHex()
		default:
			return '000000'
	}
}
