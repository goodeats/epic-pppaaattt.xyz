import { ZodError } from 'zod'
import { DesignAttributesLayoutSchema } from '#app/schema/design/layout'
import { type IDesignAttributesLayout } from './layout.server'

export const parseDesignLayoutAttributes = (
	attributes: string,
): IDesignAttributesLayout => {
	try {
		return DesignAttributesLayoutSchema.parse(JSON.parse(attributes))
	} catch (error: any) {
		if (error instanceof ZodError) {
			throw new Error(
				`Validation failed for design layout: ${error.errors.map(e => e.message).join(', ')}`,
			)
		} else {
			throw new Error(
				`Unexpected error during validation for design layout: ${error.message}`,
			)
		}
	}
}

export const stringifyDesignLayoutAttributes = (
	attributes: IDesignAttributesLayout,
): string => {
	try {
		return JSON.stringify(DesignAttributesLayoutSchema.parse(attributes))
	} catch (error: any) {
		if (error instanceof ZodError) {
			throw new Error(
				`Validation failed for design layout: ${error.errors.map(e => e.message).join(', ')}`,
			)
		} else {
			throw new Error(
				`Unexpected error during validation for design layout: ${error.message}`,
			)
		}
	}
}
