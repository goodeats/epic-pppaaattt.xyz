import { z } from 'zod'
import { DesignTypeEnum, type designTypeEnum } from './design'

// copied from ./design.ts
// may not be necessary?
export interface DesignArtboard {
	type: designTypeEnum
	ownerId: string
	artboardId?: string
}

export const ArtboardDesignDataCreateSchema = z.object({
	type: z.nativeEnum(DesignTypeEnum),
	ownerId: z.string(),
	artboardId: z.string(),
	visible: z.boolean().optional(),
	selected: z.boolean().optional(),
}) satisfies z.Schema<DesignArtboard>

export const NewArtboardDesignSchema = z.object({
	artboardId: z.string(),
	type: z.nativeEnum(DesignTypeEnum),
	visibleDesignsCount: z.number().optional(),
})

export const DeleteArtboardDesignSchema = z.object({
	id: z.string(),
	artboardId: z.string(),
	updateSelectedDesignId: z.string().optional(),
})

export const ToggleVisibleArtboardDesignSchema = z.object({
	id: z.string(),
	artboardId: z.string(),
	updateSelectedDesignId: z.string().optional(),
})

export const ReorderArtboardDesignSchema = z.object({
	id: z.string(),
	artboardId: z.string(),
	direction: z.enum(['up', 'down']),
	updateSelectedDesignId: z.string().optional(),
})
