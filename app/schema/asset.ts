import { z } from 'zod'
import { type ObjectValues } from '#app/utils/typescript-helpers'
import { AssetAttributesImageSchema } from './asset/image'

export const AssetTypeEnum = {
	IMAGE: 'image',
	// add more asset types here
} as const
export type assetTypeEnum = ObjectValues<typeof AssetTypeEnum>

export const AssetParentTypeEnum = {
	PROJECT: 'project',
	ARTWORK: 'artwork',
	ARTWORK_VERSION: 'artworkVersion',
	LAYER: 'layer',
	// add more asset parent types here
} as const
export type assetParentTypeEnum = ObjectValues<typeof AssetParentTypeEnum>

// Dummy schema for demonstration
// ! remove this when adding more asset types
export const DummySchema = z.object({})
export const AssetAttributesSchema = z.union([
	AssetAttributesImageSchema,
	DummySchema,
])
