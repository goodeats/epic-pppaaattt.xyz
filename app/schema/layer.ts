import { z } from 'zod'
import {
	type ReorderArtboardLayerSchema,
	type NewArtboardLayerSchema,
	type ToggleVisibleArtboardLayerSchema,
	type DeleteArtboardLayerSchema,
} from './layer-artboard'
import {
	type ReorderArtboardVersionLayerSchema,
	type NewArtboardVersionLayerSchema,
	type ToggleVisibleArtboardVersionLayerSchema,
	type DeleteArtboardVersionLayerSchema,
} from './layer-artboard-version'

type ObjectValues<T> = T[keyof T]
export const LayerCloneSourceTypeEnum = {
	ARTBOARD: 'artboard',
	ARTBOARD_VERSION: 'artboardVersion',
	LAYER: 'layer',
} as const
export type layerCloneSourceTypeEnum = ObjectValues<
	typeof LayerCloneSourceTypeEnum
>

export const LayerNameSchema = z.string().min(1).max(40)
export const LayerDescriptionSchema = z.string().min(0).max(400).optional()

export const EditLayerNameSchema = z.object({
	id: z.string(),
	name: LayerNameSchema,
})

export const EditLayerDescriptionSchema = z.object({
	id: z.string(),
	description: LayerDescriptionSchema,
})

// later there will be layer groups
export type NewLayerSchemaType =
	| typeof NewArtboardLayerSchema
	| typeof NewArtboardVersionLayerSchema

export type ReorderLayerSchemaType =
	| typeof ReorderArtboardLayerSchema
	| typeof ReorderArtboardVersionLayerSchema

export type ToggleVisibleLayerSchemaType =
	| typeof ToggleVisibleArtboardLayerSchema
	| typeof ToggleVisibleArtboardVersionLayerSchema

export type DeleteLayerSchemaType =
	| typeof DeleteArtboardLayerSchema
	| typeof DeleteArtboardVersionLayerSchema

export type selectArgsType = z.infer<typeof selectArgs>
const selectArgs = z.object({
	id: z.boolean().optional(),
})

export type whereArgsType = z.infer<typeof whereArgs>
const zodStringOrNull = z.union([z.string(), z.null()])
const whereArgs = z.object({
	id: z.string().optional(),
	ownerId: z.string().optional(),
	artboardId: z.string().optional(),
	artboardVersionId: z.string().optional(),
	prevId: zodStringOrNull.optional(),
	nextId: zodStringOrNull.optional(),
})

export type findLayerArgsType = z.infer<typeof findLayerArgs>
export const findLayerArgs = z.object({
	where: whereArgs,
	select: selectArgs.optional(),
})
