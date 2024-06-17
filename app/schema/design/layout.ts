import { z } from 'zod'
import { type ObjectValues } from '#app/utils/typescript-helpers'

export const LayoutStyleTypeEnum = {
	RANDOM: 'random', // place count of templates randomly in the container
	NONE: 'none', // set rows and columns to place templates in a grid
	// add more style types here, like 'spiral', 'circle', etc. ... ok copilot
} as const
export type layoutStyleTypeEnum = ObjectValues<typeof LayoutStyleTypeEnum>

const LayoutStyleSchema = z.nativeEnum(LayoutStyleTypeEnum)
const LayoutCountSchema = z.number().min(1).max(100_000)
const LayoutGridSchema = z.number().min(1).max(3_000)

// use this to (de)serealize data to/from the db
// when adding attributes to an design type,
// make sure it starts as optional or is set to a default value
// for when parsing the design from the deserializer
export const DesignAttributesLayoutSchema = z.object({
	style: LayoutStyleSchema.optional(),
	count: LayoutCountSchema.optional(),
	rows: LayoutGridSchema.optional(),
	columns: LayoutGridSchema.optional(),
})

export const NewDesignLayoutSchema = z.object({
	visible: z.boolean(),
	selected: z.boolean(),
	style: LayoutStyleSchema.default(LayoutStyleTypeEnum.RANDOM),
	count: LayoutCountSchema.default(1_000),
	rows: LayoutGridSchema.default(9),
	columns: LayoutGridSchema.default(9),
})

export const EditDesignLayoutStyleSchema = z.object({
	id: z.string(),
	style: LayoutStyleSchema,
})

export const EditDesignLayoutCountSchema = z.object({
	id: z.string(),
	count: LayoutCountSchema,
})

export const EditDesignLayoutRowsSchema = z.object({
	id: z.string(),
	rows: LayoutGridSchema,
})

export const EditDesignLayoutColumnsSchema = z.object({
	id: z.string(),
	columns: LayoutGridSchema,
})

export const DeleteDesignLayoutSchema = z.object({
	id: z.string(),
})
