import { ZodError } from 'zod'
import {
	DesignAttributesRotateSchema,
	RotateArrayBasisTypeEnum,
	RotateBasisTypeEnum,
} from '#app/schema/design/rotate'
import { type rotateBasisTypeEnum } from '#app/schema/rotate'
import {
	type IDesignRotate,
	type IDesignAttributesRotate,
} from './rotate.server'

export const parseDesignRotateAttributes = (
	attributes: string,
): IDesignAttributesRotate => {
	try {
		console.log('attributes', attributes)
		return DesignAttributesRotateSchema.parse(JSON.parse(attributes))
	} catch (error: any) {
		if (error instanceof ZodError) {
			throw new Error(
				`Validation failed for design rotate: ${error.errors.map(e => e.message).join(', ')}`,
			)
		} else {
			throw new Error(
				`Unexpected error during validation for design rotate: ${error.message}`,
			)
		}
	}
}

export const stringifyDesignRotateAttributes = (
	attributes: IDesignAttributesRotate,
): string => {
	try {
		return JSON.stringify(DesignAttributesRotateSchema.parse(attributes))
	} catch (error: any) {
		if (error instanceof ZodError) {
			throw new Error(
				`Validation failed for design rotate: ${error.errors.map(e => e.message).join(', ')}`,
			)
		} else {
			throw new Error(
				`Unexpected error during validation for design rotate: ${error.message}`,
			)
		}
	}
}

// 🥧
const PI = Math.PI

export const filterNonArrayRotates = (
	rotates: IDesignRotate[],
): IDesignRotate[] => {
	return rotates.filter(
		rotate =>
			!isArrayRotateBasisType(rotate.attributes.basis as rotateBasisTypeEnum),
	)
}

// Function to check if a basis is a visible type
export const isArrayRotateBasisType = (basis: rotateBasisTypeEnum): boolean => {
	return Object.values(RotateArrayBasisTypeEnum).includes(basis)
}

export const rotateToRadians = (rotate: IDesignRotate): number => {
	switch (rotate.attributes.basis) {
		case RotateBasisTypeEnum.DEFINED:
			return degreesToRadians(rotate.attributes.value)
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

export const degreesToRadians = (degrees: number) => degrees * (PI / 180)

const rotateRandom = (): number => {
	return Math.random() * PI * 2
}
