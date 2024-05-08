import { z } from 'zod'
import { HexcodeSchema } from './colors'

const widthMinLength = 1
const widthMaxLength = 50000
const heightMinLength = 1
const heightMaxLength = 50000

const widthSchema = z
	.number()
	.min(widthMinLength, {
		message: `Width must be at least ${widthMinLength}`,
	})
	.max(widthMaxLength, {
		message: `Width must be at most ${widthMaxLength}`,
	})

const heightSchema = z
	.number()
	.min(heightMinLength, {
		message: `Height must be at least ${heightMinLength}`,
	})
	.max(heightMaxLength, {
		message: `Height must be at most ${heightMaxLength}`,
	})

export type ArtboardVersionUpdateSchemaType =
	| typeof ArtboardVersionWidthSchema
	| typeof ArtboardVersionHeightSchema
	| typeof ArtboardVersionBackgroundSchema

export const ArtboardVersionWidthSchema = z.object({
	id: z.string(),
	width: widthSchema,
})

export const ArtboardVersionHeightSchema = z.object({
	id: z.string(),
	height: heightSchema,
})

export const ArtboardVersionBackgroundSchema = z.object({
	id: z.string(),
	background: HexcodeSchema,
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

export const ArtboardVersionDataCreateSchema = z.object({
	ownerId: z.string(),
	branchId: z.string(),
	name: z.string(),
	slug: z.string(),
	description: z.string(),
	width: widthSchema.optional(),
	height: heightSchema.optional(),
	background: HexcodeSchema.optional(),
})

export const NewArtboardVersionSchema = z.object({
	id: z.string(),
	artboardBranchId: z.string(),
	description: z.string(),
})
