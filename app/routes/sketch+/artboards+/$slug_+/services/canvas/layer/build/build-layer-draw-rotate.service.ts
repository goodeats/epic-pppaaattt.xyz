import { RotateBasisTypeEnum } from '#app/schema/rotate'
import { randomInRange } from '#app/utils/random.utils'
import { type IArtboardLayerBuild } from '../../../../queries'

// Math.PI / 1 = 180 degrees
export const canvasBuildLayerDrawRotateService = ({
	layer,
}: {
	layer: IArtboardLayerBuild
}) => {
	const { rotate } = layer
	const { basis, value } = rotate

	switch (basis) {
		case RotateBasisTypeEnum.RANDOM:
			return randomInRange(0, 2)
		case RotateBasisTypeEnum.N:
			return 0
		case RotateBasisTypeEnum.NE:
			return 0.25
		case RotateBasisTypeEnum.E:
			return 0.5
		case RotateBasisTypeEnum.SE:
			return 0.75
		case RotateBasisTypeEnum.S:
			return 1
		case RotateBasisTypeEnum.SW:
			return 1.25
		case RotateBasisTypeEnum.W:
			return 1.5
		case RotateBasisTypeEnum.NW:
			return 1.75
		default:
			// RotateBasisTypeEnum.DEFINED
			return value
	}
}
