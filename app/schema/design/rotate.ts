import { z } from 'zod'
import { type ObjectValues } from '#app/utils/typescript-helpers'

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

// use this to (de)serealize data to/from the db
// when adding attributes to an design type,
// make sure it starts as optional or is set to a default value
// for when parsing the design from the deserializer
export const DesignAttributesRotateSchema = z.object({
	basis: RotateBasisSchema,
	value: z.number(),
})

export const NewDesignRotateSchema = z.object({
	visible: z.boolean(),
	selected: z.boolean(),
	basis: RotateBasisSchema.default(RotateBasisTypeEnum.DEFINED),
	value: z.number().default(0),
})

export const EditDesignRotateBasisSchema = z.object({
	id: z.string(),
	basis: RotateBasisSchema,
})

export const EditDesignRotateValueSchema = z.object({
	id: z.string(),
	value: z.number(),
})

export const DeleteDesignRotateSchema = z.object({
	id: z.string(),
})
