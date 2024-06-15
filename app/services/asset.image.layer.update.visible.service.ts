import { invariant } from '@epic-web/invariant'
import { getAssetImage } from '#app/models/asset/image/image.get.server'
import {
	type IAssetImageLayerUpdateVisibleSubmission,
	updateAssetImageLayerVisible,
} from '#app/models/asset/image/image.update.layer.visible.server'
import { type IAssetImageUpdatedResponse } from '#app/models/asset/image/image.update.server'
import { AssetImageLayerVisibleDataSchema } from '#app/schema/asset/image.layer'
import { prisma } from '#app/utils/db.server'

export const assetImageLayerUpdateVisibleService = async ({
	userId,
	id,
	layerId,
}: IAssetImageLayerUpdateVisibleSubmission): Promise<IAssetImageUpdatedResponse> => {
	try {
		// Step 1: verify the asset image exists
		const assetImage = await getAssetImage({
			where: { id, layerId, ownerId: userId },
		})
		invariant(assetImage, 'Asset Image not found')

		// Step 2: validate asset image data
		const data = {
			visible: !assetImage.visible,
		}
		const assetImageData = AssetImageLayerVisibleDataSchema.parse(data)

		// Step 3: update the asset image via promise
		const updateAssetImagePromise = updateAssetImageLayerVisible({
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
			message: 'Unknown error: assetImageLayerUpdateVisibleService',
		}
	}
}
