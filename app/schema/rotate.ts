import { z } from 'zod'

const RotateBasisSchema = z.enum([
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
])

export const RotateDataSchema = z.object({
	designId: z.string(),
	rotation: z.number().optional(),
	basis: RotateBasisSchema.optional(),
})

export const EditDesignRotateRotationSchema = z.object({
	id: z.string(),
	designId: z.string(),
	rotation: z.number(),
})

export const EditDesignRotateBasisSchema = z.object({
	id: z.string(),
	designId: z.string(),
	basis: RotateBasisSchema,
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
	basis: RotateBasisSchema,
})
