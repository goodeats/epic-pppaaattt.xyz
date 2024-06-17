import { ZodError } from 'zod'
import { DesignAttributesRotateSchema } from '#app/schema/design/rotate'
import { type IDesignAttributesRotate } from './rotate.server'

export const parseDesignRotateAttributes = (
	attributes: string,
): IDesignAttributesRotate => {
	try {
		return DesignAttributesRotateSchema.parse(JSON.parse(attributes))
	} catch (error: any) {
		if (error instanceof ZodError) {
			throw new Error(
				`Validation failed for asset image: ${error.errors.map(e => e.message).join(', ')}`,
			)
		} else {
			throw new Error(
				`Unexpected error during validation for asset image: ${error.message}`,
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
				`Validation failed for asset image: ${error.errors.map(e => e.message).join(', ')}`,
			)
		} else {
			throw new Error(
				`Unexpected error during validation for asset image: ${error.message}`,
			)
		}
	}
}
