import { ZodError } from 'zod'
import { DesignAttributesStrokeSchema } from '#app/schema/design/stroke'
import { type IDesignAttributesStroke } from './stroke.server'

export const parseDesignStrokeAttributes = (
	attributes: string,
): IDesignAttributesStroke => {
	try {
		return DesignAttributesStrokeSchema.parse(JSON.parse(attributes))
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

export const stringifyDesignStrokeAttributes = (
	attributes: IDesignAttributesStroke,
): string => {
	try {
		return JSON.stringify(DesignAttributesStrokeSchema.parse(attributes))
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
