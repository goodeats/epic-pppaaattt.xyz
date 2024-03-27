import { type IRotate } from '#app/models/rotate.server'
import {
	RotateArrayBasisTypeEnum,
	RotateBasisTypeEnum,
	type rotateBasisTypeEnum,
} from '#app/schema/rotate'

// 🥧
const PI = Math.PI

export const filterNonArrayRotates = (rotates: IRotate[]): IRotate[] => {
	return rotates.filter(
		rotate => !isArrayRotateBasisType(rotate.basis as rotateBasisTypeEnum),
	)
}

// Function to check if a basis is a visible type
export const isArrayRotateBasisType = (basis: rotateBasisTypeEnum): boolean => {
	return Object.values(RotateArrayBasisTypeEnum).includes(basis)
}

export const rotateToRadians = (rotate: IRotate): number => {
	switch (rotate.basis) {
		case RotateBasisTypeEnum.DEFINED:
			return degreesToRadians(rotate.value)
		case RotateBasisTypeEnum.RANDOM:
			return rotateRandom()
		case RotateBasisTypeEnum.N:
			return 0
		case RotateBasisTypeEnum.NE:
			return 0.25 * PI
		case RotateBasisTypeEnum.E:
			return 0.5 * PI
		case RotateBasisTypeEnum.SE:
			return 0.75 * PI
		case RotateBasisTypeEnum.S:
			return PI
		case RotateBasisTypeEnum.SW:
			return 1.25 * PI
		case RotateBasisTypeEnum.W:
			return 1.5 * PI
		case RotateBasisTypeEnum.NW:
			return 1.75 * PI
		default:
			// just in case a DEFINED_RANDOM is passed
			return 0
	}
}

const degreesToRadians = (degrees: number) => degrees * (PI / 180)

const rotateRandom = (): number => {
	return Math.random() * PI * 2
}
