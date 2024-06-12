import { type Asset } from '@prisma/client'
import { type DateOrString } from '#app/definitions/prisma-helper'
import { type assetTypeEnum } from '#app/schema/asset'
import {
	type IAssetImage,
	type IAssetAttributesImage,
} from './image/image.server'

// Omitting 'createdAt' and 'updatedAt' from the Asset interface
// prisma query returns a string for these fields
// omit type string to ensure type safety with assetTypeEnum
// omit attributes string so that extended asset types can insert their own attributes
type BaseAsset = Omit<Asset, 'type' | 'attributes' | 'createdAt' | 'updatedAt'>

export interface IAsset extends BaseAsset {
	type: string
	attributes: string
	createdAt: DateOrString
	updatedAt: DateOrString
}

export type IAssetAttributes = IAssetAttributesImage

export interface IAssetParsed extends BaseAsset {
	type: assetTypeEnum
	attributes: IAssetAttributes
	createdAt: DateOrString
	updatedAt: DateOrString
}

export type IAssetType = IAssetImage
