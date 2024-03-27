import { type IRotate } from '#app/models/rotate.server'
import { RotateBasisTypeEnum } from '#app/schema/rotate'

export const filterDefinedRotates = (rotates: IRotate[]): IRotate[] => {
	return rotates.filter(
		rotate => rotate.basis !== RotateBasisTypeEnum.DEFINED_RANDOM,
	)
}

export const rotateValueToRadians = (rotate: IRotate): number => {
	const pi = Math.PI

	switch (rotate.basis) {
		case RotateBasisTypeEnum.DEFINED:
			return rotate.value * pi
		case RotateBasisTypeEnum.RANDOM:
			return rotateRandom() * pi
		case RotateBasisTypeEnum.N:
			return 0
		case RotateBasisTypeEnum.NE:
			return 0.25 * pi
		case RotateBasisTypeEnum.E:
			return 0.5 * pi
		case RotateBasisTypeEnum.SE:
			return 0.75 * pi
		case RotateBasisTypeEnum.S:
			return pi
		case RotateBasisTypeEnum.SW:
			return 1.25 * pi
		case RotateBasisTypeEnum.W:
			return 1.5 * pi
		case RotateBasisTypeEnum.NW:
			return 1.75 * pi
		default:
			// just in case a DEFINED_RANDOM is passed
			return 0
	}
}

const rotateRandom = (): number => {
	return Math.random() * Math.PI * 2
}
