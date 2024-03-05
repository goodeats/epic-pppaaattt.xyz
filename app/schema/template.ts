import { z } from 'zod'

export const EditArtboardTemplateStyleSchema = z.object({
	id: z.string(),
	designId: z.string(),
	artboardId: z.string(),
	style: z.enum(['triangle']),
})
