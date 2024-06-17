import { ZodError } from 'zod'
import {
	type IAssetParsed,
	type IAsset,
	type IAssetType,
	type IAssetByType,
	type IAssetsByTypeWithType,
} from '#app/models/asset/asset.server'
import { type IAssetImage } from '#app/models/asset/image/image.server'
import { parseAssetImageAttributes } from '#app/models/asset/image/utils'
import { AssetTypeEnum, type assetTypeEnum } from '#app/schema/asset'

export const deserializeAssets = ({
	assets,
}: {
	assets: IAsset[]
}): IAssetParsed[] => {
	return assets.map(asset => deserializeAsset({ asset }))
}

export const deserializeAsset = ({
	asset,
}: {
	asset: IAsset
}): IAssetParsed => {
	const type = asset.type as assetTypeEnum
	const { attributes } = asset

	const validatedAssetAttributes = validateAssetAttributes({
		type,
		attributes,
	})

	return {
		...asset,
		type,
		attributes: validatedAssetAttributes,
	}
}

export const validateAssetAttributes = ({
	type,
	attributes,
}: {
	type: assetTypeEnum
	attributes: IAsset['attributes']
}) => {
	try {
		switch (type) {
			case AssetTypeEnum.IMAGE:
				return parseAssetImageAttributes(attributes)
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

export const groupAssetsByType = ({
	assets,
}: {
	assets: IAssetParsed[]
}): IAssetByType => {
	const assetImages = filterAssetType({
		assets,
		type: AssetTypeEnum.IMAGE,
	}) as IAssetImage[]

	return {
		assetImages,
	}
}

export const assetsByTypeToPanelArray = ({
	assets,
}: {
	assets: IAssetByType
}): IAssetsByTypeWithType[] => {
	const { assetImages } = assets

	return [
		{
			type: AssetTypeEnum.IMAGE,
			assets: assetImages,
		},
	]
}
