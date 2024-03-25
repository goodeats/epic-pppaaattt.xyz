import { z } from 'zod'

export interface LayerDataCreate {
	name: string
	ownerId: string
	artboardId?: string
}

export const LayerDataCreateSchema = z.object({
	name: z.string().min(1).max(40),
	ownerId: z.string(),
	artboardId: z.string().optional(),
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
