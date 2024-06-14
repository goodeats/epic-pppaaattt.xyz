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

export const AssetImageArtworkVersionVisibleDataSchema = z.object({
	visible: z.boolean(),
})

export const NewAssetImageArtworkVersionSchema = NewAssetImageSchema.merge(
	ArtworkVersionParentSchema,
)
// this is more like a clone from artwork
export const CloneAssetImageArtworkToArtworkVersionSchema = z.object({
	assetImageId: z.string(),
	artworkVersionId: z.string(),
})

export const EditAssetImageArtworkVersionSchema = EditAssetImageSchema.merge(
	ArtworkVersionParentSchema,
)

export const EditVisibleAssetImageArtworkVersionSchema = z.object({
	id: z.string(),
	artworkVersionId: z.string(),
})

export const DeleteAssetImageArtworkVersionSchema =
	DeleteAssetImageSchema.merge(ArtworkVersionParentSchema)
