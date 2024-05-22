import { z } from 'zod'
import { LayerDescriptionSchema, LayerNameSchema } from './layer'

export interface LayerDataCreate {
	name: string
	ownerId: string
	artworkVersionId?: string
}

export const ArtworkVersionLayerDataCreateSchema = z.object({
	name: LayerNameSchema,
	ownerId: z.string(),
	artworkVersionId: z.string(),
	description: LayerDescriptionSchema.optional(),
	slug: z.string().optional(),
}) satisfies z.Schema<LayerDataCreate>

export const NewArtworkVersionLayerSchema = z.object({
	artworkVersionId: z.string(),
})

export const DeleteArtworkVersionLayerSchema = z.object({
	id: z.string(),
	artworkVersionId: z.string(),
})

export const ToggleVisibleArtworkVersionLayerSchema = z.object({
	id: z.string(),
	artworkVersionId: z.string(),
})

export const SelectArtworkVersionLayerSchema = z.object({
	id: z.string(),
	artworkVersionId: z.string(),
})

export const ReorderArtworkVersionLayerSchema = z.object({
	id: z.string(),
	artworkVersionId: z.string(),
	direction: z.enum(['up', 'down']),
})
