import { invariant } from '@epic-web/invariant'
import { getArtwork } from '#app/models/artwork/artwork.get.server'
import { type IArtwork } from '#app/models/artwork/artwork.server'
import {
	createArtworkImage,
	type IArtworkImageCreatedResponse,
} from '#app/models/images/artwork-image.create.server'
import { type IUser } from '#app/models/user/user.server'
import { ArtworkImageDataCreateSchema } from '#app/schema/artwork-image'

export const artworkImageCreateService = async ({
	userId,
	artworkId,
	blob,
	contentType,
	name,
	altText,
}: {
	userId: IUser['id']
	artworkId: IArtwork['id']
	blob: Buffer
	contentType: string
	name: string
	altText: string | null
}): Promise<IArtworkImageCreatedResponse> => {
	try {
		// Step 1: find the artwork
		const artwork = await getArtwork({
			where: { id: artworkId, ownerId: userId },
		})
		invariant(artwork, 'Artwork not found')

		// Step 2: create image
		// zod schema for blob Buffer/File is not working
		// pass in separately from validation
		const imageData = ArtworkImageDataCreateSchema.parse({
			artworkId,
			contentType,
			name,
			altText,
		})

		const createdArtworkImage = await createArtworkImage({
			data: { ...imageData, blob },
		})

		return {
			createdArtworkImage,
			success: true,
		}
	} catch (error) {
		console.log(error)
		return {
			success: false,
			message: 'Unknown error creating artwork generator.',
		}
	}
}
