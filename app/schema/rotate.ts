import { z } from 'zod'

export const RotateDataSchema = z.object({
	designId: z.string(),
	rotation: z.number().optional(),
	basis: z
		.enum(['defined', 'random', 'N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'])
		.optional(),
})

export const EditArtboardRotateSchema = z.object({
	id: z.string(),
	designId: z.string(),
	artboardId: z.string(),
	rotation: z.number(),
})

export const EditArtboardRotateBasisSchema = z.object({
	id: z.string(),
	designId: z.string(),
	artboardId: z.string(),
	basis: z.enum([
		'defined',
		'random',
		'N',
		'NE',
		'E',
		'SE',
		'S',
		'SW',
		'W',
		'NW',
	]),
})
