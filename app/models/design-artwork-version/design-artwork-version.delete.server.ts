import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { DeleteArtworkVersionDesignSchema } from '#app/schema/design-artwork-version'
import { ValidateArtworkVersionParentSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'

export const validateArtworkVersionDeleteDesignSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateArtworkVersionParentSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: DeleteArtworkVersionDesignSchema,
		strategy,
	})
}
