import { type AssetTypeEnum } from '#app/schema/asset'
import { type IAssetSubmission, type IAssetParsed } from '../asset.server'

export interface IAssetImage extends IAssetParsed {
	type: typeof AssetTypeEnum.IMAGE
	attributes: IAssetAttributesImage
}

// https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit
export type IAssetImageFit =
	| 'fill'
	| 'contain'
	| 'cover'
	| 'none'
	| 'scale-down'
// TODO: add position later
// https://developer.mozilla.org/en-US/docs/Web/CSS/object-position

export interface IAssetImageFileData {
	contentType: string
	height: number
	width: number
	size: number
	lastModified?: number
	filename: string
	fit?: IAssetImageFit
	hideOnDraw?: boolean
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
