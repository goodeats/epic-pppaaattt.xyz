import { z } from 'zod'

export const EditLayerNameSchema = z.object({
	id: z.string(),
	name: z.string().min(1).max(40),
})

export const EditLayerDescriptionSchema = z.object({
	id: z.string(),
	description: z.string().min(0).max(400).optional(),
})

export type selectArgsType = z.infer<typeof selectArgs>
const selectArgs = z.object({
	id: z.boolean().optional(),
})

export type whereArgsType = z.infer<typeof whereArgs>
const zodStringOrNull = z.union([z.string(), z.null()])
const whereArgs = z.object({
	id: z.string().optional(),
	ownerId: z.string().optional(),
	artboardId: z.string().optional(),
	prevId: zodStringOrNull.optional(),
	nextId: zodStringOrNull.optional(),
})

export type findLayerArgsType = z.infer<typeof findLayerArgs>
export const findLayerArgs = z.object({
	where: whereArgs,
	select: selectArgs.optional(),
})
