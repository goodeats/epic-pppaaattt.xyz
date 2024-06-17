import { type IAssetUpdateData, type IAsset } from '../asset.server'
import {
	type IAssetImageSubmission,
	type IAssetAttributesImage,
	type IAssetImage,
} from './image.server'

export interface IAssetImageUpdatedResponse {
	success: boolean
	message?: string
	updatedAssetImage?: IAsset
}

export interface IAssetImageUpdateSubmission extends IAssetImageSubmission {
	id: IAssetImage['id']
	blob?: Buffer
}

export interface IAssetImageUpdateData extends IAssetUpdateData {
	attributes: IAssetAttributesImage
}
