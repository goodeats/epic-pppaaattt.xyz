import { z } from 'zod'
import { HexcodeSchema } from './colors'

export const PaletteDataSchema = z.object({
	designId: z.string(),
	format: z.string().optional(),
	value: HexcodeSchema.optional(),
	opacity: z.number().optional(),
})

export const EditDesignPaletteValueSchema = z.object({
	id: z.string(),
	designId: z.string(),
	value: HexcodeSchema,
})

export const EditArtboardPaletteSchema = z.object({
	id: z.string(),
	designId: z.string(),
	artboardId: z.string(),
	value: HexcodeSchema,
})
