import { z } from 'zod'
import { HexcodeSchema } from './colors'

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
