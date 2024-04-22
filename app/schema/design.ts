import { z } from 'zod'
import { type ObjectValues } from '#app/utils/typescript-helpers'
import {
	type ToggleVisibleArtboardDesignSchema,
	type DeleteArtboardDesignSchema,
	type NewArtboardDesignSchema,
	type ReorderArtboardDesignSchema,
} from './design-artboard'
import {
	type DeleteArtboardVersionDesignSchema,
	type NewArtboardVersionDesignSchema,
	type ReorderArtboardVersionDesignSchema,
	type ToggleVisibleArtboardVersionDesignSchema,
} from './design-artboard-version'
import {
	type ToggleVisibleLayerDesignSchema,
	type DeleteLayerDesignSchema,
	type NewLayerDesignSchema,
	type ReorderLayerDesignSchema,
} from './design-layer'

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
export type designTypeEnum = ObjectValues<typeof DesignTypeEnum>

export const DesignParentTypeIdEnum = {
	ARTBOARD_VERSION_ID: 'artboardVersionId',
	LAYER_ID: 'layerId',
	// add more design types here
} as const
export type designParentTypeIdEnum = ObjectValues<typeof DesignParentTypeIdEnum>

export const DesignCloneSourceTypeEnum = {
	ARTBOARD: 'artboard',
	ARTBOARD_VERSION: 'artboardVersion',
	LAYER: 'layer',
} as const
export type designCloneSourceTypeEnum = ObjectValues<
	typeof DesignCloneSourceTypeEnum
>

export interface Design {
	type: designTypeEnum
	ownerId: string
	// one of these should be included
	artboardId?: string
	artboardVersionId?: string
	layerId?: string
}

// use this to ensure enum values are correct
export const designSchema = z.object({
	type: z.nativeEnum(DesignTypeEnum),
	ownerId: z.string(),
	artboardId: z.string().optional(),
	artboardVersionId: z.string().optional(),
	layerId: z.string().optional(),
	visible: z.boolean().optional(),
	selected: z.boolean().optional(),
}) satisfies z.Schema<Design>

export type NewDesignSchemaType =
	| typeof NewArtboardDesignSchema
	| typeof NewArtboardVersionDesignSchema
	| typeof NewLayerDesignSchema

export type ReorderDesignSchemaType =
	| typeof ReorderArtboardDesignSchema
	| typeof ReorderArtboardVersionDesignSchema
	| typeof ReorderLayerDesignSchema

export type ToggleVisibleDesignSchemaType =
	| typeof ToggleVisibleArtboardDesignSchema
	| typeof ToggleVisibleArtboardVersionDesignSchema
	| typeof ToggleVisibleLayerDesignSchema

export type DeleteDesignSchemaType =
	| typeof DeleteArtboardDesignSchema
	| typeof DeleteArtboardVersionDesignSchema
	| typeof DeleteLayerDesignSchema

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
	visible: z.boolean().optional(),
	selected: z.boolean().optional(),
	ownerId: z.string().optional(),
	artboardId: z.string().optional(),
	artboardVersionId: z.string().optional(),
	layerId: z.string().optional(),
	prevId: zodStringOrNull.optional(),
	nextId: zodStringOrNull.optional(),
})

export type findDesignArgsType = z.infer<typeof findDesignArgs>
export const findDesignArgs = z.object({
	where: whereArgs,
	select: selectArgs.optional(),
})
