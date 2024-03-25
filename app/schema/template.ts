import { z } from 'zod'

export const TemplateDataSchema = z.object({
	designId: z.string(),
	style: z.enum(['triangle']).optional(),
})

export const EditArtboardTemplateStyleSchema = z.object({
	id: z.string(),
	designId: z.string(),
	artboardId: z.string(),
	style: z.enum(['triangle']),
})
