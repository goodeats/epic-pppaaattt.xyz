import { z } from 'zod'

const MAX_NAME_LENGTH = 240
const NameSchema = z.string().max(MAX_NAME_LENGTH)

const MAX_ALT_TEXT_LENGTH = 240
const AltTextSchema = z.string().max(MAX_ALT_TEXT_LENGTH)

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

export const NewArtworkImageSchema = z.object({
	artworkId: z.string(),
	file: FileSchema,
	name: NameSchema,
	altText: AltTextSchema.optional(),
})

export const EditArtworkImageSchema = z.object({
	id: z.string(),
	artworkId: z.string().optional(),
	file: FileSchema.optional(),
	name: NameSchema,
	altText: AltTextSchema.optional(),
})

// issues with zod and Buffer
// https://github.com/colinhacks/zod/issues/387
// const BlobSchema = z.custom<File | Buffer>(data => {
// 	return typeof window === 'undefined'
// 		? data instanceof Buffer
// 		: data instanceof File
// }, 'Data is not an instance of a Buffer or File')

export const ArtworkImageDataCreateSchema = z.object({
	artworkId: z.string(),

	// blob: BlobSchema,
	// https://github.com/colinhacks/zod/issues/925
	// blob: z.instanceof(Buffer),
	// blob: z.unknown().refine(val => val !== undefined, {
	//   message: 'stream must be defined',
	// }),
	// blob: z.any().refine(val => val !== undefined, {
	// 	message: 'stream must be defined',
	// }),
	contentType: z.string(),
	name: NameSchema,
	altText: AltTextSchema,
})

export const ArtworkImageDataUpdateSchema = z.object({
	id: z.string(),
	contentType: z.string().optional(),
	name: NameSchema,
	altText: AltTextSchema,
})

export const DeleteArtworkImageSchema = z.object({
	id: z.string(),
	artworkId: z.string(),
})
