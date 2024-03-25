import { z } from 'zod'
import { HexcodeSchema } from './colors'

export const StrokeDataSchema = z.object({
	designId: z.string(),
	style: z.enum(['solid']).optional(),
	value: HexcodeSchema.optional(),
	basis: z.enum(['defined', 'random', 'palette', 'pixel']).optional(),
})

export const EditDesignStrokeValueSchema = z.object({
	id: z.string(),
	designId: z.string(),
	value: HexcodeSchema,
})

export const EditDesignStrokeStyleSchema = z.object({
	id: z.string(),
	designId: z.string(),
	style: z.enum(['solid']),
})

export const EditDesignStrokeBasisSchema = z.object({
	id: z.string(),
	designId: z.string(),
	basis: z.enum(['defined', 'random', 'palette', 'pixel']),
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
	style: z.enum(['solid']),
})

export const EditArtboardStrokeBasisSchema = z.object({
	id: z.string(),
	designId: z.string(),
	artboardId: z.string(),
	basis: z.enum(['defined', 'random', 'palette', 'pixel']),
})
