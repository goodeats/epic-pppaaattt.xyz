import { type Asset } from '@prisma/client'
import { type DateOrString } from '#app/definitions/prisma-helper'
import { type assetTypeEnum } from '#app/schema/asset'
import { type IUser } from '../user/user.server'
import {
	type IAssetImage,
	type IAssetAttributesImage,
} from './image/image.server'

// Omitting 'createdAt' and 'updatedAt' from the Asset interface
// prisma query returns a string for these fields
// omit type string to ensure type safety with assetTypeEnum
// omit attributes string so that extended asset types can insert their own attributes
// omit blob to speed up queries and reduce memory usage
// asset image blobs are requested via resource routes for example
type BaseAsset = Omit<
	Asset,
	'type' | 'attributes' | 'blob' | 'createdAt' | 'updatedAt'
>

export interface IAsset extends BaseAsset {
	type: string
	attributes: string
	createdAt: DateOrString
	updatedAt: DateOrString
}

// when adding attributes to an asset type,
// make sure it starts as optional or is set to a default value
// for when parsing the asset from the deserializer
export type IAssetAttributes = IAssetAttributesImage

export interface IAssetParsed extends BaseAsset {
	type: assetTypeEnum
	attributes: IAssetAttributes
	createdAt: DateOrString
	updatedAt: DateOrString
}

export type IAssetType = IAssetImage

interface IAssetData {
	name: string
	description?: string
}

export interface IAssetSubmission extends IAssetData {
	userId: IUser['id']
}

export interface IAssetCreateData extends IAssetData {
	ownerId: IUser['id']
	type: assetTypeEnum
	attributes: IAssetAttributes
}

export interface IAssetUpdateData extends IAssetData {
	attributes: IAssetAttributes
}
