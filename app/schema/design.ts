import { z } from 'zod'
import { HexcodeSchema } from './colors'

export const NewArtboardDesignSchema = z.object({
	artboardId: z.string(),
})

export const ArtboardBackgroundColorSchema = z.object({
	id: z.string(),
	backgroundColor: HexcodeSchema,
})

export type selectArgsType = z.infer<typeof selectArgs>
const selectArgs = z.object({
	id: z.boolean().optional(),
	width: z.boolean().optional(),
	height: z.boolean().optional(),
})

export type whereArgsType = z.infer<typeof whereArgs>
const whereArgs = z.object({
	id: z.string().optional(),
	ownerId: z.string().optional(),
})

export type findArtboardArgsType = z.infer<typeof findArtboardArgs>
export const findArtboardArgs = z.object({
	where: whereArgs,
	select: selectArgs.optional(),
})
