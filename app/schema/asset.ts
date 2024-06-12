import { z } from 'zod'
import { type IArtworkVersionWithChildren } from '#app/models/artwork-version/artwork-version.server'
import { type ILayerWithChildren } from '#app/models/layer/layer.server'
import { type ObjectValues } from '#app/utils/typescript-helpers'
import { AssetAttributesImageSchema } from './asset/image'

export const AssetTypeEnum = {
	IMAGE: 'image',
	// add more asset types here
} as const
export type assetTypeEnum = ObjectValues<typeof AssetTypeEnum>

export type AssetParentType = IArtworkVersionWithChildren | ILayerWithChildren

// Dummy schema for demonstration
// ! remove this when adding more asset types
export const DummySchema = z.object({})
export const AssetAttributesSchema = z.union([
	AssetAttributesImageSchema,
	DummySchema,
])
