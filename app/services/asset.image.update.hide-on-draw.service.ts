import { invariant } from '@epic-web/invariant'
import { getAssetImage } from '#app/models/asset/image/image.get.server'
import {
	type IAssetImageUpdateHideOnDrawSubmission,
	updateAssetImageHideOnDraw,
} from '#app/models/asset/image/image.update.hide-on-draw.server'
import { type IAssetImageUpdatedResponse } from '#app/models/asset/image/image.update.server'
import { AssetAttributesImageSchema } from '#app/schema/asset/image'
import { prisma } from '#app/utils/db.server'

export const assetImageUpdateHideOnDrawService = async ({
	userId,
	id,
}: IAssetImageUpdateHideOnDrawSubmission): Promise<IAssetImageUpdatedResponse> => {
	try {
		// Step 1: verify the asset image exists
		const assetImage = await getAssetImage({
			where: { id, ownerId: userId },
		})
		invariant(assetImage, 'Asset Image not found')
		const { attributes: assetImageAttributes } = assetImage

		// Step 2: validate asset image data
		const data = {
			...assetImageAttributes,
			hideOnDraw: !assetImageAttributes.hideOnDraw,
		}
		const assetImageData = AssetAttributesImageSchema.parse(data)

		// Step 3: update the asset image via promise
		const updateAssetImagePromise = updateAssetImageHideOnDraw({
			id,
			data: { attributes: { ...assetImageData } },
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
			message: 'Unknown error: assetImageUpdateHideOnDrawService',
		}
	}
}
