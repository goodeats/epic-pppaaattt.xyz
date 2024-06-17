import { z } from 'zod'
import {
	AssetImageDataSchema,
	DeleteAssetImageSchema,
	EditAssetImageSchema,
	NewAssetImageSchema,
} from './image'

const ArtworkParentSchema = z.object({
	artworkId: z.string(),
})

export const AssetImageArtworkDataSchema =
	AssetImageDataSchema.merge(ArtworkParentSchema)

export const NewAssetImageArtworkSchema =
	NewAssetImageSchema.merge(ArtworkParentSchema)

export const EditAssetImageArtworkSchema =
	EditAssetImageSchema.merge(ArtworkParentSchema)

export const DeleteAssetImageArtworkSchema =
	DeleteAssetImageSchema.merge(ArtworkParentSchema)
