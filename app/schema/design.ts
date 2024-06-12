import { z } from 'zod'
import { type IArtworkVersionWithDesignsAndLayers } from '#app/models/artwork-version/artwork-version.server'
import { type ILayerWithDesigns } from '#app/models/layer/layer.server'
import { type ObjectValues } from '#app/utils/typescript-helpers'
import {
	type DeleteArtworkVersionDesignSchema,
	type NewArtworkVersionDesignSchema,
	type ReorderArtworkVersionDesignSchema,
	type ToggleVisibleArtworkVersionDesignSchema,
} from './design-artwork-version'
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

export type DesignParentType =
	| IArtworkVersionWithDesignsAndLayers
	| ILayerWithDesigns

export const DesignCloneSourceTypeEnum = {
	ARTWORK_VERSION: 'artworkVersion',
	LAYER: 'layer',
} as const
export type designCloneSourceTypeEnum = ObjectValues<
	typeof DesignCloneSourceTypeEnum
>

export interface Design {
	type: designTypeEnum
	ownerId: string
	// one of these should be included
	artworkVersionId?: string
	layerId?: string
}

// use this to ensure enum values are correct
export const designSchema = z.object({
	type: z.nativeEnum(DesignTypeEnum),
	ownerId: z.string(),
	artworkVersionId: z.string().optional(),
	layerId: z.string().optional(),
	visible: z.boolean().optional(),
	selected: z.boolean().optional(),
}) satisfies z.Schema<Design>

export type NewDesignSchemaType =
	| typeof NewArtworkVersionDesignSchema
	| typeof NewLayerDesignSchema

export type ReorderDesignSchemaType =
	| typeof ReorderArtworkVersionDesignSchema
	| typeof ReorderLayerDesignSchema

export type ToggleVisibleDesignSchemaType =
	| typeof ToggleVisibleArtworkVersionDesignSchema
	| typeof ToggleVisibleLayerDesignSchema

export type DeleteDesignSchemaType =
	| typeof DeleteArtworkVersionDesignSchema
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
	artworkVersionId: z.string().optional(),
	layerId: z.string().optional(),
	prevId: zodStringOrNull.optional(),
	nextId: zodStringOrNull.optional(),
})

export type findDesignArgsType = z.infer<typeof findDesignArgs>
export const findDesignArgs = z.object({
	where: whereArgs,
	select: selectArgs.optional(),
})
