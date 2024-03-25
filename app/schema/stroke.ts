import { z } from 'zod'
import { HexcodeSchema } from './colors'

const StrokeBasisSchema = z.enum([
	'defined',
	'random',
	'palette-selected',
	'palette-random',
	'pixel',
])
const StrokeStyleSchema = z.enum(['solid'])

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
