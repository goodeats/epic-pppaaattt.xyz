import { ZodError } from 'zod'
import {
	type IAssetImage,
	type IAssetAttributesImage,
} from '#app/models/asset/image/image.server'
import { AssetAttributesImageSchema } from '#app/schema/asset/image'

export const parseAssetImageAttributes = (
	attributes: string,
): IAssetAttributesImage => {
	try {
		return AssetAttributesImageSchema.parse(JSON.parse(attributes))
	} catch (error: any) {
		if (error instanceof ZodError) {
			throw new Error(
				`Validation failed for asset image: ${error.errors.map(e => e.message).join(', ')}`,
			)
		} else {
			throw new Error(
				`Unexpected error during validation for asset image: ${error.message}`,
			)
		}
	}
}

export const stringifyAssetImageAttributes = (
	attributes: IAssetAttributesImage,
): string => {
	try {
		return JSON.stringify(AssetAttributesImageSchema.parse(attributes))
	} catch (error: any) {
		if (error instanceof ZodError) {
			throw new Error(
				`Validation failed for asset image: ${error.errors.map(e => e.message).join(', ')}`,
			)
		} else {
			throw new Error(
				`Unexpected error during validation for asset image: ${error.message}`,
			)
		}
	}
}

export const sizeInMB = (sizeInBytes: number) => {
	return (sizeInBytes / 1024 / 1024).toFixed(2)
}

export function getArtworkAssetImgSrc({
	artworkId,
	imageId,
}: {
	artworkId: string
	imageId: string
}) {
	return `/resources/artwork/${artworkId}/images/${imageId}`
}

export function getArtworkVersionAssetImgSrc({
	artworkVersionId,
	imageId,
}: {
	artworkVersionId: string
	imageId: string
}) {
	return `/resources/artwork-version/${artworkVersionId}/images/${imageId}`
}

export function getLayerAssetImgSrc({
	layerId,
	imageId,
}: {
	layerId: string
	imageId: string
}) {
	return `/resources/layer/${layerId}/images/${imageId}`
}

export const getAssetImgSrc = ({ image }: { image: IAssetImage }) => {
	if (image.artworkId) {
		return getArtworkAssetImgSrc({
			imageId: image.id,
			artworkId: image.artworkId,
		})
	} else if (image.artworkVersionId) {
		return getArtworkVersionAssetImgSrc({
			imageId: image.id,
			artworkVersionId: image.artworkVersionId,
		})
	} else if (image.layerId) {
		return getLayerAssetImgSrc({
			imageId: image.id,
			layerId: image.layerId,
		})
	} else {
		throw new Error('Image does not have artwork or artwork version id')
	}
}
