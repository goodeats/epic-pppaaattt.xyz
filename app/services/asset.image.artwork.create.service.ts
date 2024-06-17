import { invariant } from '@epic-web/invariant'
import { getArtwork } from '#app/models/artwork/artwork.get.server'
import {
	type IAssetImageArtworkCreateSubmission,
	createAssetImageArtwork,
} from '#app/models/asset/image/image.create.artwork.server'
import { type IAssetImageCreatedResponse } from '#app/models/asset/image/image.create.server'
import { AssetTypeEnum } from '#app/schema/asset'
import { AssetImageArtworkDataSchema } from '#app/schema/asset/image.artwork'
import { prisma } from '#app/utils/db.server'

export const assetImageArtworkCreateService = async ({
	userId,
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
}: IAssetImageArtworkCreateSubmission): Promise<IAssetImageCreatedResponse> => {
	try {
		// Step 1: verify the artwork exists
		const artwork = await getArtwork({
			where: { id: artworkId, ownerId: userId },
		})
		invariant(artwork, 'Artwork not found')

		// Step 2: validate asset image data
		// zod schema for blob Buffer/File is not working
		// pass in separately from validation
		const data = {
			name,
			description,
			type: AssetTypeEnum.IMAGE,
			attributes: {
				altText: altText || 'No alt text provided.',
				contentType,
				height,
				width,
				size,
				lastModified,
				filename,
			},
			visible: true,
			ownerId: userId,
			artworkId,
		}
		const assetImageData = AssetImageArtworkDataSchema.parse(data)

		// Step 3: create the asset image via promise
		const createAssetImagePromise = createAssetImageArtwork({
			data: { ...assetImageData, blob },
		})

		// Step 4: execute the transaction
		const [createdAssetImage] = await prisma.$transaction([
			createAssetImagePromise,
		])

		return {
			createdAssetImage,
			success: true,
		}
	} catch (error) {
		console.log(error)
		return {
			success: false,
			message: 'Unknown error: assetImageArtworkCreateService',
		}
	}
}
