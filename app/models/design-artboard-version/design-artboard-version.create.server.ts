import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { NewArtboardVersionDesignSchema } from '#app/schema/design-artboard-version'
import { ValidateArtboardVersionParentSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'

export const validateArtboardVersionNewDesignSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	// Set parentId to artboardVersionId and remove parentId
	const parentId = formData.get('parentId')
	formData.set('artboardVersionId', parentId || '')
	formData.delete('parentId')

	const strategy = new ValidateArtboardVersionParentSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: NewArtboardVersionDesignSchema,
		strategy,
	})
}
