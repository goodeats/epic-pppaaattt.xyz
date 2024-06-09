import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { DeleteArtworkImageSchema } from '#app/schema/artwork-image'
import { ValidateArtworkParentSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import { type IArtworkImage } from './artwork-image.server'

export interface IArtworkImageDeletedResponse {
	success: boolean
	message?: string
}

export const validateArtworkImageDeleteSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateArtworkParentSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: DeleteArtworkImageSchema,
		strategy,
	})
}

export const deleteArtworkImage = ({ id }: { id: IArtworkImage['id'] }) => {
	return prisma.artworkImage.delete({
		where: { id },
	})
}
