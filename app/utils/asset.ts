import { ZodError } from 'zod'
import {
	type IAssetParsed,
	type IAsset,
	type IAssetAttributes,
	type IAssetType,
} from '#app/models/asset/asset.server'
import { type assetTypeEnum } from '#app/schema/asset'
import { AssetAttributesImageSchema } from '#app/schema/asset/image'

// Function to parse attributes from JSON string
export const parseAttributes = (asset: IAsset): IAssetParsed => {
	try {
		return {
			...asset,
			type: asset.type as assetTypeEnum,
			attributes: JSON.parse(asset.attributes) as IAssetAttributes,
		}
	} catch (error: any) {
		throw new Error(
			`Failed to parse attributes for asset with ID ${asset.id}: ${error.message}`,
		)
	}
}

// Function to stringify attributes to JSON string
export const stringifyAttributes = (asset: IAssetParsed): IAsset => {
	try {
		return {
			...asset,
			attributes: JSON.stringify(asset.attributes),
		}
	} catch (error: any) {
		throw new Error(
			`Failed to stringify attributes for asset with ID ${asset.id}: ${error.message}`,
		)
	}
}

export const deserializeAssets = ({
	assets,
}: {
	assets: IAsset[]
}): IAssetParsed[] => {
	return assets.map(asset => {
		return deserializeAsset({ asset })
	})
}

export const deserializeAsset = ({
	asset,
}: {
	asset: IAsset
}): IAssetParsed => {
	const parsedAsset = parseAttributes(asset)
	const { type, attributes } = parsedAsset

	const validatedAssets = validateAttributes({
		attributes,
		type,
	})

	return {
		...asset,
		type,
		attributes: validatedAssets,
	}
}

export const validateAttributes = ({
	attributes,
	type,
}: {
	attributes: IAssetAttributes
	type: assetTypeEnum
}) => {
	try {
		switch (type) {
			case 'image':
				return AssetAttributesImageSchema.parse(attributes)
			default:
				throw new Error(`Unsupported asset type: ${type}`)
		}
	} catch (error: any) {
		if (error instanceof ZodError) {
			throw new Error(
				`Validation failed for asset type ${type}: ${error.errors.map(e => e.message).join(', ')}`,
			)
		} else {
			throw new Error(
				`Unexpected error during validation for asset type ${type}: ${error.message}`,
			)
		}
	}
}

export const filterAssetType = ({
	assets,
	type,
}: {
	assets: IAssetParsed[]
	type: assetTypeEnum
}): IAssetType[] => {
	return assets.filter(asset => asset.type === type)
}
