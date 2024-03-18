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

export const EditArtboardLayerNameSchema = z.object({
	id: z.string(),
	artboardId: z.string(),
	name: z.string().min(1).max(40),
})

export const EditArtboardLayerDescriptionSchema = z.object({
	id: z.string(),
	artboardId: z.string(),
	description: z.string().min(0).max(400).optional(),
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

export type findLayerArgsType = z.infer<typeof findLayerArgs>
export const findLayerArgs = z.object({
	where: whereArgs,
	select: selectArgs.optional(),
})
