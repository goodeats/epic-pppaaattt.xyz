import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { NewArtworkImageSchema } from '#app/schema/artwork-image'
import { ValidateArtworkParentSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntityImageSubmission } from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import { type IArtwork } from '../artwork/artwork.server'
import { type IArtworkImage } from './artwork-image.server'

export interface IArtworkImageCreatedResponse {
	success: boolean
	message?: string
	createdArtworkImage?: IArtworkImage
}

export const validateNewArtworkImageSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateArtworkParentSubmissionStrategy()

	return await validateEntityImageSubmission({
		userId,
		formData,
		schema: NewArtworkImageSchema,
		strategy,
	})
}

export const createArtworkImage = ({
	data,
}: {
	data: {
		artworkId: IArtwork['id']
		name: string
		altText: string | null
		contentType: string
		blob: Buffer
	}
}) => {
	return prisma.artworkImage.create({
		data,
	})
}
