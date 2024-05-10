import { json } from '@remix-run/node'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import {
	DeleteArtboardDesignSchema,
	NewArtboardDesignSchema,
	ReorderArtboardDesignSchema,
	ToggleVisibleArtboardDesignSchema,
} from '#app/schema/design-artboard'
import { artboardDesignCreateService } from '#app/services/artboard/design/create.service'
import { artboardDesignDeleteService } from '#app/services/artboard/design/delete.service'
import { artboardDesignMoveDownService } from '#app/services/artboard/design/move-down.service'
import { artboardDesignMoveUpService } from '#app/services/artboard/design/move-up.service'
import { artboardDesignToggleVisibleService } from '#app/services/artboard/design/toggle-visible.service'
import {
	notSubmissionResponse,
	submissionErrorResponse,
} from '#app/utils/conform-utils'
import {
	parseArtboardDesignSubmission,
	parseArtboardDesignUpdateSubmission,
} from './utils'

async function validateSubmission({
	userId,
	formData,
	schema,
}: {
	userId: string
	formData: FormData
	schema:
		| typeof NewArtboardDesignSchema
		| typeof ReorderArtboardDesignSchema
		| typeof ToggleVisibleArtboardDesignSchema
		| typeof DeleteArtboardDesignSchema
}) {
	const newDesign = schema === NewArtboardDesignSchema
	const submission = newDesign
		? await parseArtboardDesignSubmission({ userId, formData, schema })
		: await parseArtboardDesignUpdateSubmission({ userId, formData, schema })

	if (submission.intent !== 'submit') {
		return { response: notSubmissionResponse(submission), isValid: false }
	}
	if (!submission.value) {
		return { response: submissionErrorResponse(submission), isValid: false }
	}

	return { submission, isValid: true }
}

export async function artboardDesignNewAction({
	userId,
	formData,
}: IntentActionArgs) {
	const { submission, isValid, response } = await validateSubmission({
		userId,
		formData,
		schema: NewArtboardDesignSchema,
	})
	if (!isValid || !submission) return response

	const { artboardId, type } = submission.value
	const { success } = await artboardDesignCreateService({
		userId,
		artboardId,
		type,
	})

	if (!success) return submissionErrorResponse(submission)

	return json({ status: 'success', submission, success } as const)
}

export async function artboardDesignReorderAction({
	userId,
	formData,
}: IntentActionArgs) {
	const { submission, isValid, response } = await validateSubmission({
		userId,
		formData,
		schema: ReorderArtboardDesignSchema,
	})
	if (!isValid || !submission) return response

	const { id, artboardId, direction, updateSelectedDesignId } = submission.value
	const args = {
		userId,
		id,
		artboardId,
		updateSelectedDesignId,
	}

	const { success } =
		direction === 'up'
			? await artboardDesignMoveUpService(args)
			: await artboardDesignMoveDownService(args)

	if (!success) return submissionErrorResponse(submission)

	return json({ status: 'success', submission, success } as const)
}

export async function artboardDesignToggleVisibilityAction({
	userId,
	formData,
}: IntentActionArgs) {
	const { submission, isValid, response } = await validateSubmission({
		userId,
		formData,
		schema: ToggleVisibleArtboardDesignSchema,
	})
	if (!isValid || !submission) return response

	const { id, artboardId, updateSelectedDesignId } = submission.value
	const { success } = await artboardDesignToggleVisibleService({
		userId,
		id,
		artboardId,
		updateSelectedDesignId,
	})

	if (!success) return submissionErrorResponse(submission)

	return json({ status: 'success', submission, success } as const)
}

export async function artboardDesignDeleteAction({
	userId,
	formData,
}: IntentActionArgs) {
	const { submission, isValid, response } = await validateSubmission({
		userId,
		formData,
		schema: DeleteArtboardDesignSchema,
	})
	if (!isValid || !submission) return response

	const { id, artboardId, updateSelectedDesignId } = submission.value
	const { success } = await artboardDesignDeleteService({
		userId,
		id,
		artboardId,
		updateSelectedDesignId,
	})

	if (!success) return submissionErrorResponse(submission)

	return json({ status: 'success', submission, success } as const)
}
