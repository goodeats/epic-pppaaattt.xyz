import { z } from 'zod'
import { LayerDescriptionSchema, LayerNameSchema } from './layer'

export interface LayerDataCreate {
	name: string
	ownerId: string
	artboardVersionId?: string
}

export const ArtboardVersionLayerDataCreateSchema = z.object({
	name: LayerNameSchema,
	ownerId: z.string(),
	artboardVersionId: z.string(),
	description: LayerDescriptionSchema.optional(),
	slug: z.string().optional(),
}) satisfies z.Schema<LayerDataCreate>

export const NewArtboardVersionLayerSchema = z.object({
	artboardVersionId: z.string(),
})

export const DeleteArtboardVersionLayerSchema = z.object({
	id: z.string(),
	artboardVersionId: z.string(),
})

export const ToggleVisibleArtboardVersionLayerSchema = z.object({
	id: z.string(),
	artboardVersionId: z.string(),
})

export const ReorderArtboardVersionLayerSchema = z.object({
	id: z.string(),
	artboardVersionId: z.string(),
	direction: z.enum(['up', 'down']),
})
