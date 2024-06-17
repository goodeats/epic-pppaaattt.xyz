import { ZodError } from 'zod'
import { DesignAttributesPaletteSchema } from '#app/schema/design/palette'
import { type IDesignAttributesPalette } from './palette.server'

export const parseDesignPaletteAttributes = (
	attributes: string,
): IDesignAttributesPalette => {
	try {
		return DesignAttributesPaletteSchema.parse(JSON.parse(attributes))
	} catch (error: any) {
		if (error instanceof ZodError) {
			throw new Error(
				`Validation failed for design palette: ${error.errors.map(e => e.message).join(', ')}`,
			)
		} else {
			throw new Error(
				`Unexpected error during validation for design palette: ${error.message}`,
			)
		}
	}
}

export const stringifyDesignPaletteAttributes = (
	attributes: IDesignAttributesPalette,
): string => {
	try {
		return JSON.stringify(DesignAttributesPaletteSchema.parse(attributes))
	} catch (error: any) {
		if (error instanceof ZodError) {
			throw new Error(
				`Validation failed for design palette: ${error.errors.map(e => e.message).join(', ')}`,
			)
		} else {
			throw new Error(
				`Unexpected error during validation for design palette: ${error.message}`,
			)
		}
	}
}
