import { z } from 'zod'

const widthMinLength = 1
const widthMaxLength = 50000
// const heightMinLength = 1
// const heightMaxLength = 10000

export const ArtboardWidthSchema = z.object({
	id: z.string(),
	width: z
		.number()
		.min(widthMinLength, {
			message: `Width must be at least ${widthMinLength}`,
		})
		.max(widthMaxLength, {
			message: `Width must be at most ${widthMaxLength}`,
		}),
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
