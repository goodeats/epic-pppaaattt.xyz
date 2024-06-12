import { z } from 'zod'
import { AssetDescriptionSchema, AssetNameSchema } from './__shared'

const MAX_ALT_TEXT_LENGTH = 240
const AltTextSchema = z.string().max(MAX_ALT_TEXT_LENGTH).optional()

const MAX_MEGABYTES = 6
export const MAX_UPLOAD_SIZE = 1024 * 1024 * MAX_MEGABYTES
const ACCEPTED_IMAGE_TYPES = [
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/webp',
	'image/gif',
]

const FileSchema = z
	.instanceof(File)
	.refine(file => file.size > 0, 'Image is required')
	.refine(
		file => file.size <= MAX_UPLOAD_SIZE,
		'Image size must be less than 3MB',
	)
	.refine(
		file => ACCEPTED_IMAGE_TYPES.includes(file.type),
		'Image must be a JPEG, PNG, WEBP, or GIF',
	)

// asset image validation before saving to db

// use this to (de)serealize data to/from the db
export const AssetAttributesImageSchema = z.object({
	altText: AltTextSchema,
	contentType: z.string(),
})

// zod schema for blob Buffer/File is not working
// pass in separately from validation
export const AssetImageCreateDataSchema = z.object({
	name: AssetNameSchema,
	description: AssetDescriptionSchema,
	type: z.literal('image'),
	attributes: AssetAttributesImageSchema,
	ownerId: z.string(),
})

export const ArtworkImageDataUpdateSchema = z.object({
	id: z.string(),
	contentType: z.string().optional(),
	name: AssetNameSchema,
	altText: AltTextSchema,
})

// form data validation

export const NewAssetImageSchema = z.object({
	file: FileSchema,
	name: AssetNameSchema,
	description: AssetDescriptionSchema,
	altText: AltTextSchema,
})

export const EditAssetImageSchema = z.object({
	id: z.string(),
	file: FileSchema.optional(),
	name: AssetNameSchema,
	description: AssetDescriptionSchema,
	altText: AltTextSchema,
})

export const DeleteAssetImageSchema = z.object({
	id: z.string(),
})

// parent is artwork

const ArtworkParentSchema = z.object({
	artworkId: z.string(),
})

export const AssetImageArtworkCreateDataSchema =
	AssetImageCreateDataSchema.merge(ArtworkParentSchema)

export const NewAssetImageArtworkSchema =
	NewAssetImageSchema.merge(ArtworkParentSchema)

export const EditAssetImageArtworkSchema =
	EditAssetImageSchema.merge(ArtworkParentSchema)

export const DeleteAssetImageArtworkSchema =
	DeleteAssetImageSchema.merge(ArtworkParentSchema)
