import { z } from 'zod'
import { type IArtworkVersionWithChildren } from '#app/models/artwork-version/artwork-version.server'
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

export const DesignParentTypeEnum = {
	ARTWORK_VERSION: 'artworkVersion',
	LAYER: 'layer',
	// add more design parent types here
} as const
export type designParentTypeEnum = ObjectValues<typeof DesignParentTypeEnum>

export type DesignParentType = IArtworkVersionWithChildren | ILayerWithDesigns

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
