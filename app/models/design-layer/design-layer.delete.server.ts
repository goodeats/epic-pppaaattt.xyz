import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { DeleteLayerDesignSchema } from '#app/schema/design-layer'
import { ValidateLayerParentSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'

export const validateLayerDeleteDesignSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateLayerParentSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: DeleteLayerDesignSchema,
		strategy,
	})
}
