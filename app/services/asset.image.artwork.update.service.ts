import { invariant } from '@epic-web/invariant'
import { type IArtwork } from '#app/models/artwork/artwork.server'
import { createAssetImageArtwork } from '#app/models/asset/image/image.create.server'
import { deleteAssetImage } from '#app/models/asset/image/image.delete.server'
import { getAssetImage } from '#app/models/asset/image/image.get.server'
import { type IAssetImage } from '#app/models/asset/image/image.server'
import {
	type IAssetImageUpdatedResponse,
	updateAssetImageArtwork,
} from '#app/models/asset/image/image.update.server'
import { type IUser } from '#app/models/user/user.server'
import { AssetTypeEnum } from '#app/schema/asset'
import { AssetImageArtworkDataSchema } from '#app/schema/asset/image'
import { prisma } from '#app/utils/db.server'

export const assetImageArtworkUpdateService = async ({
	userId,
	id,
	artworkId,
	name,
	description,
	blob,
	contentType,
	altText,
}: {
	userId: IUser['id']
	id: IAssetImage['id']
	artworkId: IArtwork['id']
	name: string
	description?: string
	blob: Buffer
	contentType: string
	altText: string | null
}): Promise<IAssetImageUpdatedResponse> => {
	try {
		// Step 1: verify the asset image exists
		const assetImage = await getAssetImage({
			where: { id, artworkId, ownerId: userId },
		})
		invariant(assetImage, 'Asset Image not found')

		// Step 2: validate asset image data
		const data = {
			name,
			description,
			type: AssetTypeEnum.IMAGE,
			attributes: {
				contentType: contentType ?? assetImage.attributes.contentType,
				altText: altText || 'No alt text provided.',
			},
			ownerId: assetImage.ownerId,
			artworkId: assetImage.artworkId,
		}
		const assetImageData = AssetImageArtworkDataSchema.parse(data)

		if (blob) {
			// Step 3: delete the asset image with old blob via promise
			const deleteArtworkImagePromise = deleteAssetImage({ id })

			// Step 4: create the asset image with new blob via promise
			const createAssetImagePromise = createAssetImageArtwork({
				data: { ...assetImageData, blob },
			})

			// Step 5: execute the transaction
			const [, updatedAssetImage] = await prisma.$transaction([
				deleteArtworkImagePromise,
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
