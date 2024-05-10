import { z } from 'zod'
import { LayerNameSchema } from './layer'

export interface LayerDataCreate {
	name: string
	ownerId: string
	artboardId?: string
}

export const ArtboardLayerDataCreateSchema = z.object({
	name: LayerNameSchema,
	ownerId: z.string(),
	artboardId: z.string(),
}) satisfies z.Schema<LayerDataCreate>

export const NewArtboardLayerSchema = z.object({
	artboardId: z.string(),
})

export const DeleteArtboardLayerSchema = z.object({
	id: z.string(),
	artboardId: z.string(),
})

export const ToggleVisibleArtboardLayerSchema = z.object({
	id: z.string(),
	artboardId: z.string(),
})

export const ReorderArtboardLayerSchema = z.object({
	id: z.string(),
	artboardId: z.string(),
	direction: z.enum(['up', 'down']),
})
