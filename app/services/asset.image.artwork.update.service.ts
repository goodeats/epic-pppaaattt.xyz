import { invariant } from '@epic-web/invariant'
import { createAssetImageArtwork } from '#app/models/asset/image/image.create.artwork.server'
import { deleteAssetImage } from '#app/models/asset/image/image.delete.server'
import { getAssetImage } from '#app/models/asset/image/image.get.server'
import {
	type IAssetImageArtworkUpdateSubmission,
	updateAssetImageArtwork,
} from '#app/models/asset/image/image.update.artwork.server'
import { type IAssetImageUpdatedResponse } from '#app/models/asset/image/image.update.server'
import { AssetTypeEnum } from '#app/schema/asset'
import { AssetImageArtworkDataSchema } from '#app/schema/asset/image.artwork'
import { prisma } from '#app/utils/db.server'

export const assetImageArtworkUpdateService = async ({
	userId,
	id,
	artworkId,
	name,
	description,
	blob,
	altText,
	contentType,
	height,
	width,
	size,
	lastModified,
	filename,
}: IAssetImageArtworkUpdateSubmission): Promise<IAssetImageUpdatedResponse> => {
	try {
		// Step 1: verify the asset image exists
		const assetImage = await getAssetImage({
			where: { id, artworkId, ownerId: userId },
		})
		invariant(assetImage, 'Asset Image not found')
		const { attributes: assetImageAttributes } = assetImage

		// Step 2: validate asset image data
		const data = {
			name,
			description,
			type: AssetTypeEnum.IMAGE,
			attributes: {
				altText: altText || 'No alt text provided.',
				contentType: contentType ?? assetImageAttributes.contentType,
				height: height ?? assetImageAttributes.height,
				width: width ?? assetImageAttributes.width,
				size: size ?? assetImageAttributes.size,
				lastModified: lastModified ?? assetImageAttributes.lastModified,
				filename: filename ?? assetImageAttributes.filename,
			},
			ownerId: assetImage.ownerId,
			artworkId: assetImage.artworkId,
		}
		const assetImageData = AssetImageArtworkDataSchema.parse(data)

		if (blob) {
			// Step 3: delete the asset image with old blob via promise
			const deleteAssetImageArtworkPromise = deleteAssetImage({ id })

			// Step 4: create the asset image with new blob via promise
			const createAssetImagePromise = createAssetImageArtwork({
				data: { ...assetImageData, blob },
			})

			// Step 5: execute the transaction
			const [, updatedAssetImage] = await prisma.$transaction([
				deleteAssetImageArtworkPromise,
				createAssetImagePromise,
			])

			return {
				updatedAssetImage,
				success: true,
			}
		} else {
			// Step 3: update the asset image via promise
			const updateAssetImagePromise = updateAssetImageArtwork({
				id,
				data: { ...assetImageData },
			})

			// Step 4: execute the transaction
			const [updatedAssetImage] = await prisma.$transaction([
				updateAssetImagePromise,
			])

			return {
				updatedAssetImage,
				success: true,
			}
		}
	} catch (error) {
		console.error(error)
		return {
			success: false,
			message: 'Unknown error: assetImageArtworkCreateService',
		}
	}
}
