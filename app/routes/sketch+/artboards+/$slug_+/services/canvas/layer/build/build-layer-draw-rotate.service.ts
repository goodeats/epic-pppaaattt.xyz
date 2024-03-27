import { RotateBasisTypeEnum } from '#app/schema/rotate'
import { randomInRange } from '#app/utils/random.utils'
import { rotateToRadians } from '#app/utils/rotate'
import { type IArtboardLayerBuild } from '../../../../queries'

export const canvasBuildLayerDrawRotateService = ({
	layer,
	index,
}: {
	layer: IArtboardLayerBuild
	index: number
}) => {
	const { rotate } = layer
	const { basis } = rotate

	if (basis === RotateBasisTypeEnum.DEFINED_RANDOM) {
		return randomInRotates({ layer })
	}

	return rotateToRadians(rotate)
}

const randomInRotates = ({ layer }: { layer: IArtboardLayerBuild }) => {
	const { rotates } = layer

	// If there are no rotates or the array is empty, return 0
	if (!rotates || !rotates.length) return 0

	const randomIndex = randomInRange(0, rotates.length - 1)
	const rotate = rotates[randomIndex]

	return rotateToRadians(rotate)
}
