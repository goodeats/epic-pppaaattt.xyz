import { z } from 'zod'

export const RotateBasisTypeEnum = {
	DEFINED: 'defined', // exact rotation value
	RANDOM: 'random', // random rotation value
	N: 'N', // 0 degrees
	NE: 'NE', // 45 degrees
	E: 'E', // 90 degrees
	SE: 'SE', // 135 degrees
	S: 'S', // 180 degrees
	SW: 'SW', // 225 degrees
	W: 'W', // 270 degrees
	NW: 'NW', // 315 degrees
	// add more basis types here
} as const
type ObjectValues<T> = T[keyof T]
export type rotateBasisTypeEnum = ObjectValues<typeof RotateBasisTypeEnum>

const RotateBasisSchema = z.nativeEnum(RotateBasisTypeEnum)

export const RotateDataSchema = z.object({
	designId: z.string(),
	value: z.number().optional(),
	basis: RotateBasisSchema.optional(),
})

export const EditDesignRotateValueSchema = z.object({
	id: z.string(),
	designId: z.string(),
	value: z.number(),
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
	value: z.number(),
})

export const EditArtboardRotateBasisSchema = z.object({
	id: z.string(),
	designId: z.string(),
	artboardId: z.string(),
	basis: RotateBasisSchema,
})
