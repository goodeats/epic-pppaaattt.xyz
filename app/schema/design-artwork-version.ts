import { z } from 'zod'
import { DesignTypeEnum, type designTypeEnum } from './design'

// copied from ./design.ts
// may not be necessary?
export interface DesignArtworkVersion {
	type: designTypeEnum
	ownerId: string
	artworkVersionId: string
}

export const ArtworkVersionDesignDataCreateSchema = z.object({
	type: z.nativeEnum(DesignTypeEnum),
	ownerId: z.string(),
	artworkVersionId: z.string(),
	visible: z.boolean().optional(),
	selected: z.boolean().optional(),
}) satisfies z.Schema<DesignArtworkVersion>

export const NewArtworkVersionDesignSchema = z.object({
	artworkVersionId: z.string(),
	type: z.nativeEnum(DesignTypeEnum),
	visibleDesignsCount: z.number().optional(),
})

export const DeleteArtworkVersionDesignSchema = z.object({
	id: z.string(),
	artworkVersionId: z.string(),
	updateSelectedDesignId: z.string().optional(),
})

export const ToggleVisibleArtworkVersionDesignSchema = z.object({
	id: z.string(),
	artworkVersionId: z.string(),
	updateSelectedDesignId: z.string().optional(),
})

export const ReorderArtworkVersionDesignSchema = z.object({
	id: z.string(),
	artworkVersionId: z.string(),
	direction: z.enum(['up', 'down']),
	updateSelectedDesignId: z.string().optional(),
})
