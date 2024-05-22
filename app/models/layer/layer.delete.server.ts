import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { DeleteArtworkVersionLayerSchema } from '#app/schema/layer-artwork-version'
import { ValidateArtworkVersionParentSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import { type ILayer } from '../layer/layer.server'

export interface ILayerDeletedResponse {
	success: boolean
	message?: string
}

export const validateArtworkVersionDeleteLayerSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateArtworkVersionParentSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: DeleteArtworkVersionLayerSchema,
		strategy,
	})
}

export const deleteLayer = ({ id }: { id: ILayer['id'] }) => {
	return prisma.layer.delete({
		where: { id },
	})
}
