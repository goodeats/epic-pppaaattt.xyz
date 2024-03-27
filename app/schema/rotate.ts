import { z } from 'zod'

type ObjectValues<T> = T[keyof T]

// use this for determining if build should iterate through rotates array
export const RotateArrayBasisTypeEnum = {
	VISIBLE_RANDOM: 'visible-random',
	VISIBLE_LOOP: 'visible-loop',
	VISIBLE_LOOP_REVERSE: 'visible-loop-reverse',
} as const
export type rotateArrayBasisTypeEnum = ObjectValues<
	typeof RotateArrayBasisTypeEnum
>

export const RotateIndividualBasisTypeEnum = {
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
} as const
export type rotateIndividualBasisTypeEnum = ObjectValues<
	typeof RotateIndividualBasisTypeEnum
>

export const RotateBasisTypeEnum = {
	...RotateIndividualBasisTypeEnum,
	...RotateArrayBasisTypeEnum,
	// add more basis types here
} as const
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
