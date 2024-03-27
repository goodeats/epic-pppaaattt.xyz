import { z } from 'zod'
import { HexcodeSchema } from './colors'

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
type ObjectValues<T> = T[keyof T]
export type strokeBasisTypeEnum = ObjectValues<typeof StrokeBasisTypeEnum>
export type strokeStyleTypeEnum = ObjectValues<typeof StrokeStyleTypeEnum>

const StrokeBasisSchema = z.nativeEnum(StrokeBasisTypeEnum)
const StrokeStyleSchema = z.nativeEnum(StrokeStyleTypeEnum)

export const StrokeDataSchema = z.object({
	designId: z.string(),
	style: StrokeStyleSchema.optional(),
	value: HexcodeSchema.optional(),
	basis: StrokeBasisSchema.optional(),
})

export const EditDesignStrokeValueSchema = z.object({
	id: z.string(),
	designId: z.string(),
	value: HexcodeSchema,
})

export const EditDesignStrokeStyleSchema = z.object({
	id: z.string(),
	designId: z.string(),
	style: StrokeStyleSchema,
})

export const EditDesignStrokeBasisSchema = z.object({
	id: z.string(),
	designId: z.string(),
	basis: StrokeBasisSchema,
})

export const EditArtboardStrokeSchema = z.object({
	id: z.string(),
	designId: z.string(),
	artboardId: z.string(),
	value: HexcodeSchema,
})

export const EditArtboardStrokeStyleSchema = z.object({
	id: z.string(),
	designId: z.string(),
	artboardId: z.string(),
	style: StrokeStyleSchema,
})

export const EditArtboardStrokeBasisSchema = z.object({
	id: z.string(),
	designId: z.string(),
	artboardId: z.string(),
	basis: StrokeBasisSchema,
})
