import { z } from 'zod'
import { HexcodeSchema } from './colors'

const FillBasisSchema = z.enum([
	'defined',
	'random',
	'palette-selected',
	'palette-random',
	'pixel',
])
const FillStyleSchema = z.enum(['solid', 'none'])

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
