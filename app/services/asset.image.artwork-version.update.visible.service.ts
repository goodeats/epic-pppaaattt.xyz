import { invariant } from '@epic-web/invariant'
import { getAssetImage } from '#app/models/asset/image/image.get.server'
import {
	updateAssetImageArtworkVersionVisible,
	type IAssetImageArtworkVersionUpdateVisibleSubmission,
} from '#app/models/asset/image/image.update.artwork-version.visible.server'
import { type IAssetImageUpdatedResponse } from '#app/models/asset/image/image.update.server'
import { AssetImageArtworkVersionVisibleDataSchema } from '#app/schema/asset/image.artwork-version'
import { prisma } from '#app/utils/db.server'

export const assetImageArtworkVersionUpdateVisibleService = async ({
	userId,
	id,
	artworkVersionId,
}: IAssetImageArtworkVersionUpdateVisibleSubmission): Promise<IAssetImageUpdatedResponse> => {
	try {
		// Step 1: verify the asset image exists
		const assetImage = await getAssetImage({
			where: { id, artworkVersionId, ownerId: userId },
		})
		invariant(assetImage, 'Asset Image not found')

		// Step 2: validate asset image data
		const data = {
			visible: !assetImage.visible,
		}
		const assetImageData = AssetImageArtworkVersionVisibleDataSchema.parse(data)

		// Step 3: update the asset image via promise
		const updateAssetImagePromise = updateAssetImageArtworkVersionVisible({
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
	} catch (error) {
		console.error(error)
		return {
			success: false,
			message: 'Unknown error: assetImageArtworkVersionUpdateVisibleService',
		}
	}
}
