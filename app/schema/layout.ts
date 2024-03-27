import { z } from 'zod'

export const LayoutStyleTypeEnum = {
	RANDOM: 'random', // place count of templates randomly in the container
	GRID: 'grid', // set rows and columns to place templates in a grid
	// add more style types here, like 'spiral', 'circle', etc. ... ok copilot
} as const
type ObjectValues<T> = T[keyof T]
export type layoutStyleTypeEnum = ObjectValues<typeof LayoutStyleTypeEnum>

const LayoutStyleSchema = z.nativeEnum(LayoutStyleTypeEnum)
const LayoutCountSchema = z.number().min(1).max(100_000)
const LayoutGridSchema = z.number().min(1).max(3_000)

export const LayoutDataSchema = z.object({
	designId: z.string(),
	style: LayoutStyleSchema.optional(),
	count: LayoutCountSchema.optional(),
	rows: LayoutGridSchema.optional(),
	columns: LayoutGridSchema.optional(),
})

export const EditDesignLayoutStyleSchema = z.object({
	id: z.string(),
	designId: z.string(),
	style: LayoutStyleSchema,
})

export const EditDesignLayoutCountSchema = z.object({
	id: z.string(),
	designId: z.string(),
	count: LayoutCountSchema,
})

export const EditDesignLayoutRowsSchema = z.object({
	id: z.string(),
	designId: z.string(),
	rows: LayoutGridSchema,
})

export const EditDesignLayoutColumnsSchema = z.object({
	id: z.string(),
	designId: z.string(),
	columns: LayoutGridSchema,
})

export const EditArtboardLayoutStyleSchema = z.object({
	id: z.string(),
	designId: z.string(),
	artboardId: z.string(),
	style: LayoutStyleSchema,
})

export const EditArtboardLayoutCountSchema = z.object({
	id: z.string(),
	designId: z.string(),
	artboardId: z.string(),
	count: LayoutCountSchema,
})

export const EditArtboardLayoutRowsSchema = z.object({
	id: z.string(),
	designId: z.string(),
	artboardId: z.string(),
	rows: LayoutGridSchema,
})

export const EditArtboardLayoutColumnsSchema = z.object({
	id: z.string(),
	designId: z.string(),
	artboardId: z.string(),
	columns: LayoutGridSchema,
})
