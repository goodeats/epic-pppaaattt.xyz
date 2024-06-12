import { type AssetTypeEnum } from '#app/schema/asset'
import { type IAssetCreateData, type IAsset } from '../asset.server'
import {
	type IAssetImageSubmission,
	type IAssetAttributesImage,
} from './image.server'

export interface IAssetImageCreatedResponse {
	success: boolean
	message?: string
	createdAssetImage?: IAsset
}

export interface IAssetImageCreateSubmission extends IAssetImageSubmission {
	blob: Buffer
}

export interface IAssetImageCreateData extends IAssetCreateData {
	type: typeof AssetTypeEnum.IMAGE
	attributes: IAssetAttributesImage
	blob: Buffer
}
