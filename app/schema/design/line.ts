import { z } from 'zod'
import { type ObjectValues } from '#app/utils/typescript-helpers'

export const LineFormatTypeEnum = {
	PIXEL: 'pixel', // exact pixel value
	PERCENT: 'percent', // percent of basis length
	// add more format types here
} as const
export const LineBasisTypeEnum = {
	SIZE: 'size',
	WIDTH: 'width',
	HEIGHT: 'height',
	CANVAS_WIDTH: 'canvas-width',
	CANVAS_HEIGHT: 'canvas-height',
	// add more styles here, like gradient, pattern, etc.
} as const
export type lineFormatTypeEnum = ObjectValues<typeof LineFormatTypeEnum>
export type lineBasisTypeEnum = ObjectValues<typeof LineBasisTypeEnum>

const LineFormatSchema = z.nativeEnum(LineFormatTypeEnum)
const LineBasisSchema = z.nativeEnum(LineBasisTypeEnum)
const LineWidthSchema = z.number().positive()

// use this to (de)serealize data to/from the db
// when adding attributes to an design type,
// make sure it starts as optional or is set to a default value
// for when parsing the design from the deserializer
export const DesignAttributesLineSchema = z.object({
	basis: LineBasisSchema,
	format: LineFormatSchema,
	width: LineWidthSchema,
})

export const NewDesignLineSchema = z.object({
	visible: z.boolean(),
	selected: z.boolean(),
	basis: LineBasisSchema.default(LineBasisTypeEnum.SIZE),
	format: LineFormatSchema.default(LineFormatTypeEnum.PERCENT),
	width: LineWidthSchema.default(3),
})

export const EditDesignLineBasisSchema = z.object({
	id: z.string(),
	basis: LineBasisSchema,
})

export const EditDesignLineFormatSchema = z.object({
	id: z.string(),
	format: LineFormatSchema,
})

export const EditDesignLineWidthSchema = z.object({
	id: z.string(),
	width: LineWidthSchema,
})

export const DeleteDesignLineSchema = z.object({
	id: z.string(),
})
