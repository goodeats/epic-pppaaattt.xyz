import { invariant } from '@epic-web/invariant'
import { getArtworkVersion } from '#app/models/artwork-version/artwork-version.get.server'
import {
	type IAssetImageArtworkVersionCreateSubmission,
	createAssetImageArtworkVersion,
} from '#app/models/asset/image/image.create.artwork-version.server'
import { type IAssetImageCreatedResponse } from '#app/models/asset/image/image.create.server'
import { AssetTypeEnum } from '#app/schema/asset'
import { AssetImageArtworkVersionDataSchema } from '#app/schema/asset/image.artwork-version'
import { prisma } from '#app/utils/db.server'

export const assetImageArtworkVersionCreateService = async ({
	userId,
	artworkVersionId,
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
}: IAssetImageArtworkVersionCreateSubmission): Promise<IAssetImageCreatedResponse> => {
	try {
		// Step 1: verify the artworkVersion exists
		const artworkVersion = await getArtworkVersion({
			where: { id: artworkVersionId, ownerId: userId },
		})
		invariant(artworkVersion, 'Artwork not found')

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
			ownerId: userId,
			artworkVersionId,
		}
		const assetImageData = AssetImageArtworkVersionDataSchema.parse(data)

		// Step 3: create the asset image via promise
		const createAssetImagePromise = createAssetImageArtworkVersion({
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
			message: 'Unknown error: assetImageArtworkVersionCreateService',
		}
	}
}
