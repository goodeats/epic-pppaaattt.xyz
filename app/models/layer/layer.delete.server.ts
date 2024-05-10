import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { DeleteArtboardVersionLayerSchema } from '#app/schema/layer-artboard-version'
import { ValidateArtboardVersionParentSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import { type ILayer } from '../layer.server'

export interface ILayerDeletedResponse {
	success: boolean
	message?: string
}

export const validateArtboardVersionDeleteLayerSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateArtboardVersionParentSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: DeleteArtboardVersionLayerSchema,
		strategy,
	})
}

export const deleteLayer = ({ id }: { id: ILayer['id'] }) => {
	return prisma.layer.delete({
		where: { id },
	})
}
