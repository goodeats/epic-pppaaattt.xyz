import { type AssetTypeEnum } from '#app/schema/asset'
import { type IAssetSubmission, type IAssetParsed } from '../asset.server'

export interface IAssetImage extends IAssetParsed {
	type: typeof AssetTypeEnum.IMAGE
	attributes: IAssetAttributesImage
}

export interface IAssetImageFileData {
	contentType: string
	height: number
	width: number
	size: number
	lastModified?: number
	filename: string
}

// when adding attributes to an asset type,
// make sure it starts as optional or is set to a default value
// for when parsing the asset from the deserializer
export interface IAssetAttributesImage extends IAssetImageFileData {
	altText?: string
}

export interface IAssetImageSrc {
	contentType: string
	blob: Buffer
}

export interface IAssetImageSubmission
	extends IAssetSubmission,
		IAssetAttributesImage {}
