import { z } from 'zod'
import { HexcodeSchema } from '../colors'

const PaletteValueSchema = HexcodeSchema

// use this to (de)serealize data to/from the db
// when adding attributes to an design type,
// make sure it starts as optional or is set to a default value
// for when parsing the design from the deserializer
export const DesignAttributesPaletteSchema = z.object({
	value: PaletteValueSchema.optional(),
})

export const NewDesignPaletteSchema = z.object({
	visible: z.boolean(),
	selected: z.boolean(),
	value: PaletteValueSchema.default('000000'),
})

export const EditDesignPaletteValueSchema = z.object({
	id: z.string(),
	width: PaletteValueSchema,
})

export const DeleteDesignPaletteSchema = z.object({
	id: z.string(),
})
