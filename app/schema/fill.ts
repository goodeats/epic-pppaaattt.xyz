import { z } from 'zod'
import { type ObjectValues } from '#app/utils/typescript-helpers'
import { HexcodeSchema } from './colors'

export const FillBasisTypeEnum = {
	DEFINED: 'defined', // exact hex value
	RANDOM: 'random', // random hex value
	PALETTE_SELECTED: 'palette-selected', // first palette in array
	PALETTE_RANDOM: 'palette-random', // random palette in array
	PALETTE_LOOP: 'palette-loop', // loop palette array by index
	PALETTE_LOOP_REVERSE: 'palette-loop-reverse', // loop reversed palette array by index
	PIXEL: 'pixel', // pixel color
	// add more basis types here
} as const
export const FillStyleTypeEnum = {
	SOLID: 'solid', // flat color
	NONE: 'none', // no fill
	// add more styles here, like gradient, pattern, etc.
} as const
export type fillBasisTypeEnum = ObjectValues<typeof FillBasisTypeEnum>
export type fillStyleTypeEnum = ObjectValues<typeof FillStyleTypeEnum>

const FillBasisSchema = z.nativeEnum(FillBasisTypeEnum)
const FillStyleSchema = z.nativeEnum(FillStyleTypeEnum)

export const FillDataSchema = z.object({
	designId: z.string(),
	style: FillStyleSchema.optional(),
	value: HexcodeSchema.optional(),
	basis: FillBasisSchema.optional(),
})

export type DesignFillUpdateSchemaType =
	| typeof EditDesignFillValueSchema
	| typeof EditDesignFillBasisSchema
	| typeof EditDesignFillStyleSchema

export const EditDesignFillValueSchema = z.object({
	id: z.string(),
	designId: z.string(),
	value: HexcodeSchema,
})

export const EditDesignFillStyleSchema = z.object({
	id: z.string(),
	designId: z.string(),
	style: FillStyleSchema,
})

export const EditDesignFillBasisSchema = z.object({
	id: z.string(),
	designId: z.string(),
	basis: FillBasisSchema,
})
