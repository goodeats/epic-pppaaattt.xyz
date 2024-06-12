import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { DeleteAssetImageArtworkSchema } from '#app/schema/asset/image'
import { ValidateAssetSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import { type IAssetImage } from './image.server'

export interface IAssetImageDeletedResponse {
	success: boolean
	message?: string
}

export const validateDeleteAssetImageArtworkSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateAssetSubmissionStrategy()

	// not validateEntityImageSubmission
	// there is no image file to parse and transform
	return await validateEntitySubmission({
		userId,
		formData,
		schema: DeleteAssetImageArtworkSchema,
		strategy,
	})
}

export const deleteAssetImage = ({ id }: { id: IAssetImage['id'] }) => {
	return prisma.asset.delete({
		where: { id },
	})
}
