import { z } from 'zod'
import { HexcodeSchema } from './colors'

const widthMinLength = 1
const widthMaxLength = 50000
const heightMinLength = 1
const heightMaxLength = 50000

export const ArtboardVersionWidthSchema = z.object({
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

export const ArtboardVersionHeightSchema = z.object({
	id: z.string(),
	height: z
		.number()
		.min(heightMinLength, {
			message: `Height must be at least ${heightMinLength}`,
		})
		.max(heightMaxLength, {
			message: `Height must be at most ${heightMaxLength}`,
		}),
})

export const ArtboardVersionBackgroundSchema = z.object({
	id: z.string(),
	backgroundColor: HexcodeSchema,
})

export const ArtboardVersionSelectedDesignsSchema = z.object({
	paletteId: z.string().optional(),
	sizeId: z.string().optional(),
	fillId: z.string().optional(),
	strokeId: z.string().optional(),
	lineId: z.string().optional(),
	rotateId: z.string().optional(),
	layoutId: z.string().optional(),
	templateId: z.string().optional(),
})

export type ArtboardVersionSelectedDesignsType = z.infer<
	typeof ArtboardVersionSelectedDesignsSchema
>
