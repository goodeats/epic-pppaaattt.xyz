import { z } from 'zod'
import { DesignTypeEnum, type designTypeEnum } from './design'

interface DesignLayer {
	type: designTypeEnum
	ownerId: string
	layerId: string
}

export const LayerDesignDataCreateSchema = z.object({
	type: z.nativeEnum(DesignTypeEnum),
	ownerId: z.string(),
	layerId: z.string(),
	visible: z.boolean().optional(),
	selected: z.boolean().optional(),
}) satisfies z.Schema<DesignLayer>

export const NewLayerDesignSchema = z.object({
	layerId: z.string(),
	type: z.nativeEnum(DesignTypeEnum),
})

export const DeleteLayerDesignSchema = z.object({
	id: z.string(),
	layerId: z.string(),
})

export const ToggleVisibleLayerDesignSchema = z.object({
	id: z.string(),
	layerId: z.string(),
})

export const ReorderLayerDesignSchema = z.object({
	id: z.string(),
	layerId: z.string(),
	direction: z.enum(['up', 'down']),
})
