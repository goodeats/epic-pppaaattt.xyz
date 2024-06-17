import { z } from 'zod'
import { type ObjectValues } from '#app/utils/typescript-helpers'
import { HexcodeSchema } from '../colors'

export const StrokeBasisTypeEnum = {
	DEFINED: 'defined', // exact hex value
	RANDOM: 'random', // random hex value
	PALETTE_SELECTED: 'palette-selected', // first palette in array
	PALETTE_RANDOM: 'palette-random', // random palette in array
	PALETTE_LOOP: 'palette-loop', // loop palette array by index
	PALETTE_LOOP_REVERSE: 'palette-loop-reverse', // loop reversed palette array by index
	PIXEL: 'pixel', // pixel color
	// add more basis types here
} as const
export const StrokeStyleTypeEnum = {
	SOLID: 'solid', // flat color
	// add more styles here, like gradient, pattern, etc.
} as const
export type strokeBasisTypeEnum = ObjectValues<typeof StrokeBasisTypeEnum>
export type strokeStyleTypeEnum = ObjectValues<typeof StrokeStyleTypeEnum>

const StrokeBasisSchema = z.nativeEnum(StrokeBasisTypeEnum)
const StrokeStyleSchema = z.nativeEnum(StrokeStyleTypeEnum)

// use this to (de)serealize data to/from the db
// when adding attributes to an design type,
// make sure it starts as optional or is set to a default value
// for when parsing the design from the deserializer
export const DesignAttributesStrokeSchema = z.object({
	basis: StrokeBasisSchema,
	style: StrokeStyleSchema,
	value: HexcodeSchema,
})

export const NewDesignStrokeSchema = z.object({
	visible: z.boolean(),
	selected: z.boolean(),
	basis: StrokeBasisSchema.default(StrokeBasisTypeEnum.DEFINED),
	style: StrokeStyleSchema.default(StrokeStyleTypeEnum.SOLID),
	value: HexcodeSchema.default('000000'),
})

export const EditDesignStrokeBasisSchema = z.object({
	id: z.string(),
	basis: StrokeBasisSchema,
})

export const EditDesignStrokeStyleSchema = z.object({
	id: z.string(),
	style: StrokeStyleSchema,
})

export const EditDesignStrokeValueSchema = z.object({
	id: z.string(),
	value: HexcodeSchema,
})

export const DeleteDesignStrokeSchema = z.object({
	id: z.string(),
})
