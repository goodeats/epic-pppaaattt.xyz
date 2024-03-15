import { randomInRange } from '#app/utils/random.utils'
import { type IArtboardLayerBuild } from '../../../../queries'

// Math.PI / 1 = 180 degrees
export const canvasBuildLayerDrawRotateService = ({
	layer,
}: {
	layer: IArtboardLayerBuild
}) => {
	const { rotate } = layer
	const { basis, rotation } = rotate

	switch (basis) {
		case 'random':
			return randomInRange(0, 360)
		case 'N':
			return 0
		case 'NE':
			return 0.25
		case 'E':
			return 0.5
		case 'SE':
			return 0.75
		case 'S':
			return 1
		case 'SW':
			return 1.25
		case 'W':
			return 1.5
		case 'NW':
			return 1.75
		default:
			return rotation
	}
}
