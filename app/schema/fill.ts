import { z } from 'zod'
import { HexcodeSchema } from './colors'

export const FillBasisTypeEnum = {
	DEFINED: 'defined', // exact hex value
	RANDOM: 'random', // random hex value
	PALETTE_SELECTED: 'palette-selected', // first palette
	PALETTE_RANDOM: 'palette-random', // random palette
	PALETTE_LOOP: 'palette-loop', // loop palette for each layer item
	PIXEL: 'pixel', // pixel color
	// add more basis types here
} as const
export const FillStyleTypeEnum = {
	SOLID: 'solid', // flat color
	NONE: 'none', // no fill
	// add more styles here, like gradient, pattern, etc.
} as const
type ObjectValues<T> = T[keyof T]
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

export const EditArtboardFillSchema = z.object({
	id: z.string(),
	designId: z.string(),
	artboardId: z.string(),
	value: HexcodeSchema,
})

export const EditArtboardFillStyleSchema = z.object({
	id: z.string(),
	designId: z.string(),
	artboardId: z.string(),
	style: FillStyleSchema,
})

export const EditArtboardFillBasisSchema = z.object({
	id: z.string(),
	designId: z.string(),
	artboardId: z.string(),
	basis: FillBasisSchema,
})
