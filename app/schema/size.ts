import { z } from 'zod'

export const EditArtboardSizeSchema = z.object({
	id: z.string(),
	designId: z.string(),
	artboardId: z.string(),
	// assuming percentage format is fixed for now
	value: z.number().min(1).max(1000),
})
