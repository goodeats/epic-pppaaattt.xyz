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

export type ArtworkVersionUpdateSchemaType =
	| typeof ArtworkVersionWidthSchema
	| typeof ArtworkVersionHeightSchema
	| typeof ArtworkVersionBackgroundSchema
	| typeof ArtworkVersionStarredSchema
	| typeof ArtworkVersionPublishedSchema

export const ArtworkVersionWidthSchema = z.object({
	id: z.string(),
	width: widthSchema,
})

export const ArtworkVersionHeightSchema = z.object({
	id: z.string(),
	height: heightSchema,
})

export const ArtworkVersionBackgroundSchema = z.object({
	id: z.string(),
	background: HexcodeSchema,
})

export const ArtworkVersionStarredSchema = z.object({
	id: z.string(),
})

export const ArtworkVersionPublishedSchema = z.object({
	id: z.string(),
})

export const ArtworkVersionWatermarkSchema = z.object({
	id: z.string(),
})

export const ArtworkVersionSelectedDesignsSchema = z.object({
	paletteId: z.string().optional(),
	sizeId: z.string().optional(),
	fillId: z.string().optional(),
	strokeId: z.string().optional(),
	lineId: z.string().optional(),
	rotateId: z.string().optional(),
	layoutId: z.string().optional(),
	templateId: z.string().optional(),
})

export type ArtworkVersionSelectedDesignsType = z.infer<
	typeof ArtworkVersionSelectedDesignsSchema
>

export const ArtworkVersionDataCreateSchema = z.object({
	ownerId: z.string(),
	branchId: z.string(),
	name: z.string().optional(),
	slug: z.string().optional(),
	description: z.string(),
	width: widthSchema.optional(),
	height: heightSchema.optional(),
	background: HexcodeSchema.optional(),
})

export const NewArtworkVersionSchema = z.object({
	id: z.string(),
	branchId: z.string(),
	description: z.string(),
})
