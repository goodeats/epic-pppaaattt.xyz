import { z } from 'zod'
import { type ObjectValues } from '#app/utils/typescript-helpers'
import {
	AssetDataSchema,
	AssetDescriptionSchema,
	AssetNameSchema,
} from './__shared'

const MAX_ALT_TEXT_LENGTH = 240
const AltTextSchema = z.string().max(MAX_ALT_TEXT_LENGTH).optional()

const DimensionsSchema = z.number().int().positive()

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

// https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit
export const AssetImageFitTypeEnum = {
	FILL: 'fill', // stretch to fill content box
	CONTAIN: 'contain', // scale to maintain aspect ratio, letterboxed
	COVER: 'cover', // scale to maintain aspect ratio, overflow clipped
	NONE: 'none', // not resized
	SCALE_DOWN: 'scale-down', // none or contain, smaller of the two
	// add more asset fit types here
} as const
export type assetImageFitTypeEnum = ObjectValues<typeof AssetImageFitTypeEnum>
// TODO: add position later
// https://developer.mozilla.org/en-US/docs/Web/CSS/object-position

// asset image validation before saving to db

// use this to (de)serealize data to/from the db
// when adding attributes to an asset type,
// make sure it starts as optional or is set to a default value
// for when parsing the asset from the deserializer
export const AssetAttributesImageSchema = z.object({
	altText: AltTextSchema,
	contentType: z.string(),
	height: DimensionsSchema,
	width: DimensionsSchema,
	size: z.number(),
	lastModified: z.number().optional(),
	filename: z.string(),
	fit: z.nativeEnum(AssetImageFitTypeEnum).optional(),
})

// zod schema for blob Buffer/File is not working
// pass in separately from validation
export const AssetImageDataSchema = z
	.object({
		type: z.literal('image'),
		attributes: AssetAttributesImageSchema,
	})
	.merge(AssetDataSchema)

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

export const EditAssetImageFitSchema = z.object({
	id: z.string(),
	fit: z.nativeEnum(AssetImageFitTypeEnum),
})

export const DeleteAssetImageSchema = z.object({
	id: z.string(),
})
