import { z } from 'zod'
import { HexcodeSchema } from './colors'

export const PaletteDataSchema = z.object({
	designId: z.string(),
	value: HexcodeSchema.optional(),
	format: z.string().optional(),
	opacity: z.number().optional(),
})

export const EditArtboardPaletteSchema = z.object({
	id: z.string(),
	designId: z.string(),
	artboardId: z.string(),
	value: HexcodeSchema,
})
