import { invariant } from '@epic-web/invariant'
import { type IArtwork } from '#app/models/artwork/artwork.server'
import { createArtworkImage } from '#app/models/images/artwork-image.create.server'
import { deleteArtworkImage } from '#app/models/images/artwork-image.delete.server'
import { getArtworkImage } from '#app/models/images/artwork-image.get.server'
import {
	updateArtworkImage,
	type IArtworkImageUpdatedResponse,
} from '#app/models/images/artwork-image.update.server'
import { type IUser } from '#app/models/user/user.server'
import { ArtworkImageDataCreateSchema } from '#app/schema/artwork-image'
import { prisma } from '#app/utils/db.server'

export const artworkImageUpdateService = async ({
	userId,
	id,
	blob,
	contentType,
	name,
	altText,
}: {
	userId: IUser['id']
	id: IArtwork['id']
	blob?: Buffer
	contentType?: string
	name: string
	altText: string | null
}): Promise<IArtworkImageUpdatedResponse> => {
	try {
		// can't seem to update the blob of an image
		// so just going to replace with newly created image
		if (blob) {
			// Step 1: find the artwork image
			const artworkImage = await getArtworkImage({
				where: { id },
			})
			invariant(artworkImage, 'Artwork Image not found')

			// Step 2: validata the new image data
			const imageData = ArtworkImageDataCreateSchema.parse({
				artworkId: artworkImage.artworkId,
				contentType,
				name,
				altText,
			})

			// Step 3: replace the artwork image via promises
			const replaceArtworkImagePromises = []

			// delete the old image
			const deleteArtworkImagePromise = deleteArtworkImage({ id })
			replaceArtworkImagePromises.push(deleteArtworkImagePromise)

			// create the new image
			const createArtworkImagePromise = createArtworkImage({
				data: { ...imageData, blob },
			})
			replaceArtworkImagePromises.push(createArtworkImagePromise)

			const [, replacedArtworkImage] = await prisma.$transaction(
				replaceArtworkImagePromises,
			)

			return {
				success: true,
				updatedArtworkImage: replacedArtworkImage,
			}
		} else {
			return await updateArtworkImage({
				id,
				name,
				altText,
			})
		}
	} catch (error) {
		console.log(error)
		return {
			success: false,
			message: 'Unknown error creating artwork generator.',
		}
	}
}
