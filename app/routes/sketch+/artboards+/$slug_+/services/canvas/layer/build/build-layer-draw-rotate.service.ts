import { RotateBasisTypeEnum } from '#app/schema/rotate'
import {
	getCircularItemInArray,
	getRandomItemInArray,
	getReverseCircularItemInArray,
} from '#app/utils/array.utils'
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

	switch (basis) {
		case RotateBasisTypeEnum.DEFINED:
			return rotateToRadians(rotate)
		case RotateBasisTypeEnum.VISIBLE_RANDOM:
			return randomInRotates({ layer })
		case RotateBasisTypeEnum.VISIBLE_LOOP:
			return loopInRotates({ layer, index })
		case RotateBasisTypeEnum.VISIBLE_LOOP_REVERSE:
			return reverseLoopInRotates({ layer, index })
		default:
			return rotateToRadians(rotate)
	}
}

const randomInRotates = ({ layer }: { layer: IArtboardLayerBuild }) => {
	const { rotates } = layer

	// If there are no rotates or the array is empty, return 0
	if (!rotates?.length) return 0

	const rotate = getRandomItemInArray(rotates)
	return rotateToRadians(rotate)
}

const loopInRotates = ({
	layer,
	index,
}: {
	layer: IArtboardLayerBuild
	index: number
}) => {
	const { rotates } = layer

	// If there are no rotates or the array is empty, return 0
	if (!rotates?.length) return 0

	const rotate = getCircularItemInArray(rotates, index)
	return rotateToRadians(rotate)
}

const reverseLoopInRotates = ({
	layer,
	index,
}: {
	layer: IArtboardLayerBuild
	index: number
}) => {
	const { rotates } = layer

	// If there are no rotates or the array is empty, return 0
	if (!rotates?.length) return 0

	const rotate = getReverseCircularItemInArray(rotates, index)
	return rotateToRadians(rotate)
}
