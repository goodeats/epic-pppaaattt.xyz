import { z } from 'zod'

export const NewArtboardLayerSchema = z.object({
	artboardId: z.string(),
})

export const DeleteArtboardLayerSchema = z.object({
	id: z.string(),
	artboardId: z.string(),
})

export const ToggleVisibilityArtboardLayerSchema = z.object({
	id: z.string(),
	artboardId: z.string(),
})

export const ReorderArtboardLayerSchema = z.object({
	id: z.string(),
	artboardId: z.string(),
	direction: z.enum(['up', 'down']),
})

export type selectArgsType = z.infer<typeof selectArgs>
const selectArgs = z.object({
	id: z.boolean().optional(),
})

export type whereArgsType = z.infer<typeof whereArgs>
const whereArgs = z.object({
	id: z.string().optional(),
	ownerId: z.string().optional(),
	artboardId: z.string().optional(),
})

export type findDesignArgsType = z.infer<typeof findDesignArgs>
export const findDesignArgs = z.object({
	where: whereArgs,
	select: selectArgs.optional(),
})
