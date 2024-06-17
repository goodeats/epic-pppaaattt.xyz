import { z } from 'zod'
import { type ObjectValues } from '#app/utils/typescript-helpers'
import { HexcodeSchema } from '../colors'

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

// use this to (de)serealize data to/from the db
// when adding attributes to an design type,
// make sure it starts as optional or is set to a default value
// for when parsing the design from the deserializer
export const DesignAttributesFillSchema = z.object({
	basis: FillBasisSchema,
	style: FillStyleSchema,
	value: HexcodeSchema,
})

export const NewDesignFillSchema = z.object({
	visible: z.boolean(),
	selected: z.boolean(),
	basis: FillBasisSchema.default(FillBasisTypeEnum.DEFINED),
	style: FillStyleSchema.default(FillStyleTypeEnum.SOLID),
	value: HexcodeSchema.default('000000'),
})

export const EditDesignFillBasisSchema = z.object({
	id: z.string(),
	basis: FillBasisSchema,
})

export const EditDesignFillStyleSchema = z.object({
	id: z.string(),
	style: FillStyleSchema,
})

export const EditDesignFillValueSchema = z.object({
	id: z.string(),
	value: HexcodeSchema,
})

export const DeleteDesignFillSchema = z.object({
	id: z.string(),
})
