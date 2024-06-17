import { ZodError } from 'zod'
import { DesignAttributesFillSchema } from '#app/schema/design/fill'
import { type IDesignAttributesFill } from './fill.server'

export const parseDesignFillAttributes = (
	attributes: string,
): IDesignAttributesFill => {
	try {
		return DesignAttributesFillSchema.parse(JSON.parse(attributes))
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

export const stringifyDesignFillAttributes = (
	attributes: IDesignAttributesFill,
): string => {
	try {
		return JSON.stringify(DesignAttributesFillSchema.parse(attributes))
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
