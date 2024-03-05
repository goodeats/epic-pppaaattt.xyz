import { z } from 'zod'

export const EditArtboardLineWidthSchema = z.object({
	id: z.string(),
	designId: z.string(),
	artboardId: z.string(),
	width: z.number().min(1).max(100),
})
