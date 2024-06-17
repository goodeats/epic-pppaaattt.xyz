import { z } from 'zod'
import {
	AssetImageDataSchema,
	DeleteAssetImageSchema,
	EditAssetImageSchema,
	NewAssetImageSchema,
} from './image'

const LayerParentSchema = z.object({
	layerId: z.string(),
})

export const AssetImageLayerDataSchema =
	AssetImageDataSchema.merge(LayerParentSchema)

export const AssetImageLayerVisibleDataSchema = z.object({
	visible: z.boolean(),
})

export const NewAssetImageLayerSchema =
	NewAssetImageSchema.merge(LayerParentSchema)

export const EditAssetImageLayerSchema =
	EditAssetImageSchema.merge(LayerParentSchema)

export const EditVisibleAssetImageLayerSchema = z.object({
	id: z.string(),
	layerId: z.string(),
})

export const DeleteAssetImageLayerSchema =
	DeleteAssetImageSchema.merge(LayerParentSchema)
