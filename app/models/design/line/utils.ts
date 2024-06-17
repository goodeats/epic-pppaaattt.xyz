import { ZodError } from 'zod'
import { DesignAttributesLineSchema } from '#app/schema/design/line'
import { type IDesignAttributesLine } from './line.server'

export const parseDesignLineAttributes = (
	attributes: string,
): IDesignAttributesLine => {
	try {
		return DesignAttributesLineSchema.parse(JSON.parse(attributes))
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

export const stringifyDesignLineAttributes = (
	attributes: IDesignAttributesLine,
): string => {
	try {
		return JSON.stringify(DesignAttributesLineSchema.parse(attributes))
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
