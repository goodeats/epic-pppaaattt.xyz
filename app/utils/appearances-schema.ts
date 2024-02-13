import { z } from 'zod'
import { AppearanceType } from './appearances'
import { stringToHexcode, validateStringIsHexcode } from './colors'

export const PaletteValueSchema = z.object({
	appearanceId: z.string(),
	appearanceType: z.nativeEnum(AppearanceType),
	value: stringToHexcode.refine(validateStringIsHexcode, {
		message: 'Value must be valid hexcode',
	}),
})

export const SizeValueSchema = z.object({
	appearanceId: z.string(),
	appearanceType: z.nativeEnum(AppearanceType),
	value: z.number().min(0).max(100),
})
