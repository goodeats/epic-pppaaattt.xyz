import { z } from 'zod'
import {
	AssetImageDataSchema,
	DeleteAssetImageSchema,
	EditAssetImageSchema,
	NewAssetImageSchema,
} from './image'

const ArtworkVersionParentSchema = z.object({
	artworkVersionId: z.string(),
})

export const AssetImageArtworkVersionDataSchema = AssetImageDataSchema.merge(
	ArtworkVersionParentSchema,
)

export const NewAssetImageArtworkVersionSchema = NewAssetImageSchema.merge(
	ArtworkVersionParentSchema,
)

export const EditAssetImageArtworkVersionSchema = EditAssetImageSchema.merge(
	ArtworkVersionParentSchema,
)

export const DeleteAssetImageArtworkVersionSchema =
	DeleteAssetImageSchema.merge(ArtworkVersionParentSchema)
