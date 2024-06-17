import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { DeleteAssetImageArtworkVersionSchema } from '#app/schema/asset/image.artwork-version'
import { ValidateAssetSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'

export const validateDeleteAssetImageArtworkVersionSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateAssetSubmissionStrategy()

	// not validateEntityImageSubmission
	// there is no image file to parse and transform
	return await validateEntitySubmission({
		userId,
		formData,
		schema: DeleteAssetImageArtworkVersionSchema,
		strategy,
	})
}
