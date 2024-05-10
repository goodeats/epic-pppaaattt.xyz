import { z } from 'zod'
import { DesignTypeEnum, type designTypeEnum } from './design'

// copied from ./design.ts
// may not be necessary?
export interface DesignArtboardVersion {
	type: designTypeEnum
	ownerId: string
	artboardVersionId: string
}

export const ArtboardVersionDesignDataCreateSchema = z.object({
	type: z.nativeEnum(DesignTypeEnum),
	ownerId: z.string(),
	artboardVersionId: z.string(),
	visible: z.boolean().optional(),
	selected: z.boolean().optional(),
}) satisfies z.Schema<DesignArtboardVersion>

export const NewArtboardVersionDesignSchema = z.object({
	artboardVersionId: z.string(),
	type: z.nativeEnum(DesignTypeEnum),
	visibleDesignsCount: z.number().optional(),
})

export const DeleteArtboardVersionDesignSchema = z.object({
	id: z.string(),
	artboardVersionId: z.string(),
	updateSelectedDesignId: z.string().optional(),
})

export const ToggleVisibleArtboardVersionDesignSchema = z.object({
	id: z.string(),
	artboardVersionId: z.string(),
	updateSelectedDesignId: z.string().optional(),
})

export const ReorderArtboardVersionDesignSchema = z.object({
	id: z.string(),
	artboardVersionId: z.string(),
	direction: z.enum(['up', 'down']),
	updateSelectedDesignId: z.string().optional(),
})
