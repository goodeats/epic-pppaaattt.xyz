import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import {
	ArtworkImageDataUpdateSchema,
	EditArtworkImageSchema,
} from '#app/schema/artwork-image'
import { ValidateArtworkImageSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntityImageSubmission } from '#app/utils/conform-utils'
import { findFirstArtworkImageInstance } from '#app/utils/prisma-extensions-artwork-image'
import { type IArtworkImage } from './artwork-image.server'

export interface IArtworkImageUpdatedResponse {
	success: boolean
	message?: string
	updatedArtworkImage?: IArtworkImage
}

export const validateEditArtworkImageSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateArtworkImageSubmissionStrategy()

	return await validateEntityImageSubmission({
		userId,
		formData,
		schema: EditArtworkImageSchema,
		strategy,
	})
}

const getArtworkImageInstance = async ({ id }: { id: IArtworkImage['id'] }) => {
	return await findFirstArtworkImageInstance({
		where: { id },
	})
}

export const updateArtworkImage = async ({
	id,
	name,
	altText,
}: {
	id: IArtworkImage['id']
	name: string
	altText: string | null
}): Promise<IArtworkImageUpdatedResponse> => {
	const artworkImage = await getArtworkImageInstance({ id })
	if (!artworkImage) return { success: false }

	try {
		const data = ArtworkImageDataUpdateSchema.parse({ id, name, altText })

		artworkImage.name = data.name
		artworkImage.altText = data.altText
		artworkImage.updatedAt = new Date()
		await artworkImage.save()

		return { success: true, updatedArtworkImage: artworkImage }
	} catch (error) {
		// consider how to handle this error where this is called
		console.log('updateArtworkImage error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
