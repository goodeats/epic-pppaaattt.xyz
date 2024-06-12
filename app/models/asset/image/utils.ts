import { ZodError } from 'zod'
import { type IAssetAttributesImage } from '#app/models/asset/image/image.server'
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
