import { z } from 'zod'
import { HexcodeSchema } from './colors'

export const FillDataSchema = z.object({
	designId: z.string(),
	style: z.enum(['solid', 'none']).optional(),
	value: HexcodeSchema.optional(),
	basis: z.enum(['defined', 'random', 'palette', 'pixel']).optional(),
})

export const EditDesignFillValueSchema = z.object({
	id: z.string(),
	designId: z.string(),
	value: HexcodeSchema,
})

export const EditDesignFillStyleSchema = z.object({
	id: z.string(),
	designId: z.string(),
	style: z.enum(['solid', 'none']),
})

export const EditDesignFillBasisSchema = z.object({
	id: z.string(),
	designId: z.string(),
	basis: z.enum(['defined', 'random', 'palette', 'pixel']),
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
	style: z.enum(['solid', 'none']),
})

export const EditArtboardFillBasisSchema = z.object({
	id: z.string(),
	designId: z.string(),
	artboardId: z.string(),
	basis: z.enum(['defined', 'random', 'palette', 'pixel']),
})
