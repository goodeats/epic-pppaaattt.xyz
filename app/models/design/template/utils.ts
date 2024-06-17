import { ZodError } from 'zod'
import { DesignAttributesTemplateSchema } from '#app/schema/design/template'
import { type IDesignAttributesTemplate } from './template.server'

export const parseDesignTemplateAttributes = (
	attributes: string,
): IDesignAttributesTemplate => {
	try {
		return DesignAttributesTemplateSchema.parse(JSON.parse(attributes))
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

export const stringifyDesignTemplateAttributes = (
	attributes: IDesignAttributesTemplate,
): string => {
	try {
		return JSON.stringify(DesignAttributesTemplateSchema.parse(attributes))
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
