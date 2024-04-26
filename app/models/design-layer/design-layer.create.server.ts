import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { NewLayerDesignSchema } from '#app/schema/design-layer'
import { ValidateLayerParentSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'

export const validateLayerNewDesignSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateLayerParentSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: NewLayerDesignSchema,
		strategy,
	})
}
