import { ZodError } from 'zod'
import { DesignAttributesSizeSchema } from '#app/schema/design/size'
import { type IDesignAttributesSize } from './size.server'

export const parseDesignSizeAttributes = (
	attributes: string,
): IDesignAttributesSize => {
	try {
		return DesignAttributesSizeSchema.parse(JSON.parse(attributes))
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

export const stringifyDesignSizeAttributes = (
	attributes: IDesignAttributesSize,
): string => {
	try {
		return JSON.stringify(DesignAttributesSizeSchema.parse(attributes))
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
