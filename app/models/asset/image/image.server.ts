import { type AssetTypeEnum } from '#app/schema/asset'
import { type IAssetParsed } from '../asset.server'

export interface IAssetImage extends IAssetParsed {
	type: typeof AssetTypeEnum.IMAGE
	attributes: IAssetAttributesImage
}

export interface IAssetAttributesImage {
	altText?: string
	contentType: string
}

export interface IAssetImageSrc {
	contentType: string
	blob: Buffer
}
