import { z } from 'zod'

export const SizeDataSchema = z.object({
	designId: z.string(),
	format: z.string().optional(),
	value: z.number().optional(),
	basis: z.string().optional(),
})

export const EditDesignSizeValueSchema = z.object({
	id: z.string(),
	designId: z.string(),
	// assuming percentage format is fixed for now
	value: z.number().min(1).max(1000),
})

export const EditArtboardSizeSchema = z.object({
	id: z.string(),
	designId: z.string(),
	artboardId: z.string(),
	// assuming percentage format is fixed for now
	value: z.number().min(1).max(1000),
})
