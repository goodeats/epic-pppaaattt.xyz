import { z } from 'zod'
import { HexcodeSchema } from './colors'

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
