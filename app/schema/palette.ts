import { z } from 'zod'
import { HexcodeSchema } from './colors'

export const PaletteDataSchema = z.object({
	designId: z.string(),
	format: z.string().optional(),
	value: HexcodeSchema.optional(),
	opacity: z.number().optional(),
})

export type DesignPaletteUpdateSchemaType = typeof EditDesignPaletteValueSchema

export const EditDesignPaletteValueSchema = z.object({
	id: z.string(),
	designId: z.string(),
	value: HexcodeSchema,
})
