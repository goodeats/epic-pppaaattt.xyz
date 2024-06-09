import { type User } from '@prisma/client'
import { type IArtwork } from '#app/models/artwork/artwork.server'
import {
	type IArtworkImageDeletedResponse,
	deleteArtworkImage,
} from '#app/models/images/artwork-image.delete.server'
import { type IArtworkImage } from '#app/models/images/artwork-image.server'
import { prisma } from '#app/utils/db.server'

export const artworkImageDeleteService = async ({
	userId,
	id,
	artworkId,
}: {
	userId: User['id']
	id: IArtworkImage['id']
	artworkId: IArtwork['id']
}): Promise<IArtworkImageDeletedResponse> => {
	try {
		const deleteArtworkImagePromises = []

		const deleteArtworkImagePromise = deleteArtworkImage({ id })
		deleteArtworkImagePromises.push(deleteArtworkImagePromise)

		await prisma.$transaction(deleteArtworkImagePromises)

		return { success: true }
	} catch (error) {
		console.log('artworkImageDeleteService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
