import { z } from 'zod'

export const LineDataSchema = z.object({
	designId: z.string(),
	width: z.number().min(1).max(100).optional(),
})

export const EditArtboardLineWidthSchema = z.object({
	id: z.string(),
	designId: z.string(),
	artboardId: z.string(),
	width: z.number().min(1).max(100),
})
