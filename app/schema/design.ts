import { z } from 'zod'

export const DesignTypeEnum = {
	PALETTE: 'palette',
	SIZE: 'size',
	FILL: 'fill',
	STROKE: 'stroke',
	LINE: 'line',
	ROTATE: 'rotate',
	LAYOUT: 'layout',
	TEMPLATE: 'template',
	// add more design types here
} as const
type ObjectValues<T> = T[keyof T]
export type designTypeEnum = ObjectValues<typeof DesignTypeEnum>

export interface Design {
	type: designTypeEnum
	ownerId: string
	artboardId?: string
}

// use this to ensure enum values are correct
export const designSchema = z.object({
	type: z.nativeEnum(DesignTypeEnum),
	ownerId: z.string(),
	artboardId: z.string().optional(),
	layerId: z.string().optional(),
	visible: z.boolean().optional(),
	selected: z.boolean().optional(),
}) satisfies z.Schema<Design>

export const LayerDesignDataCreateSchema = z.object({
	type: z.nativeEnum(DesignTypeEnum),
	ownerId: z.string(),
	layerId: z.string(),
	visible: z.boolean().optional(),
	selected: z.boolean().optional(),
}) satisfies z.Schema<Design>

export type selectArgsType = z.infer<typeof selectArgs>
const selectArgs = z.object({
	id: z.boolean().optional(),
})

export type whereArgsType = z.infer<typeof whereArgs>
const arrayOfIds = z.object({ in: z.array(z.string()) })
const zodStringOrNull = z.union([z.string(), z.null()])
const whereArgs = z.object({
	id: z.union([z.string(), arrayOfIds]).optional(),
	type: z.nativeEnum(DesignTypeEnum).optional(),
	selected: z.boolean().optional(),
	ownerId: z.string().optional(),
	artboardId: z.string().optional(),
	layerId: z.string().optional(),
	prevId: zodStringOrNull.optional(),
	nextId: zodStringOrNull.optional(),
})

export type findDesignArgsType = z.infer<typeof findDesignArgs>
export const findDesignArgs = z.object({
	where: whereArgs,
	select: selectArgs.optional(),
})
