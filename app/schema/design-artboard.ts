import { z } from 'zod'
import { DesignTypeEnum, type designTypeEnum } from './design'

export interface Design {
	type: designTypeEnum
	ownerId: string
	artboardId?: string
}

export const ArtboardDesignDataCreateSchema = z.object({
	type: z.nativeEnum(DesignTypeEnum),
	ownerId: z.string(),
	artboard: z.string(),
	visible: z.boolean().optional(),
	selected: z.boolean().optional(),
}) satisfies z.Schema<Design>

export const NewArtboardDesignSchema = z.object({
	artboardId: z.string(),
	type: z.nativeEnum(DesignTypeEnum),
	visibleDesignsCount: z.number(),
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
