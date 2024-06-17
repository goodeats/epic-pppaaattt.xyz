import { z } from 'zod'
import { type ObjectValues } from '#app/utils/typescript-helpers'

export const SizeFormatTypeEnum = {
	PIXEL: 'pixel', // exact pixel value
	PERCENT: 'percent', // percent of basis length
	// add more format types here
} as const
export const SizeBasisTypeEnum = {
	WIDTH: 'width',
	HEIGHT: 'height',
	CANVAS_WIDTH: 'canvas-width',
	CANVAS_HEIGHT: 'canvas-height',
	// add more styles here, like gradient, pattern, etc.
} as const

export type sizeFormatTypeEnum = ObjectValues<typeof SizeFormatTypeEnum>
export type sizeBasisTypeEnum = ObjectValues<typeof SizeBasisTypeEnum>

const SizeFormatSchema = z.nativeEnum(SizeFormatTypeEnum)
const SizeBasisSchema = z.nativeEnum(SizeBasisTypeEnum)
const SizeValueSchema = z.number().positive()

// use this to (de)serealize data to/from the db
// when adding attributes to an design type,
// make sure it starts as optional or is set to a default value
// for when parsing the design from the deserializer
export const DesignAttributesSizeSchema = z.object({
	basis: SizeBasisSchema,
	format: SizeFormatSchema,
	value: SizeValueSchema,
})

export const NewDesignSizeSchema = z.object({
	visible: z.boolean(),
	selected: z.boolean(),
	basis: SizeBasisSchema.default(SizeBasisTypeEnum.WIDTH),
	format: SizeFormatSchema.default(SizeFormatTypeEnum.PERCENT),
	value: SizeValueSchema.default(10),
})

export const EditDesignSizeBasisSchema = z.object({
	id: z.string(),
	basis: SizeBasisSchema,
})

export const EditDesignSizeFormatSchema = z.object({
	id: z.string(),
	format: SizeFormatSchema,
})

export const EditDesignSizeValueSchema = z.object({
	id: z.string(),
	value: SizeValueSchema,
})

export const DeleteDesignSizeSchema = z.object({
	id: z.string(),
})
