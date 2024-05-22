import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import {
	ReorderArtworkVersionDesignSchema,
	ToggleVisibleArtworkVersionDesignSchema,
} from '#app/schema/design-artwork-version'
import { ValidateArtworkVersionParentSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'

export const validateArtworkVersionToggleVisibeDesignSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateArtworkVersionParentSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: ToggleVisibleArtworkVersionDesignSchema,
		strategy,
	})
}

export const validateArtworkVersionReorderDesignSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateArtworkVersionParentSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: ReorderArtworkVersionDesignSchema,
		strategy,
	})
}
