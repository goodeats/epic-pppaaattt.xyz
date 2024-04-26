import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import {
	ReorderLayerDesignSchema,
	ToggleVisibleLayerDesignSchema,
} from '#app/schema/design-layer'
import { ValidateLayerParentSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'

export const validateLayerToggleVisibeDesignSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateLayerParentSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: ToggleVisibleLayerDesignSchema,
		strategy,
	})
}

export const validateLayerReorderDesignSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateLayerParentSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: ReorderLayerDesignSchema,
		strategy,
	})
}
