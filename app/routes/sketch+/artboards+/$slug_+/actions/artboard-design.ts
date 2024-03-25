import { json } from '@remix-run/node'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import {
	DeleteArtboardDesignSchema,
	NewArtboardDesignSchema,
	ReorderArtboardDesignSchema,
	ToggleVisibleArtboardDesignSchema,
} from '#app/schema/design-artboard'
import {
	notSubmissionResponse,
	submissionErrorResponse,
} from '#app/utils/conform-utils'
import { artboardDesignCreateService } from '../services/artboard/design/create.service'
import { artboardDesignDeleteService } from '../services/artboard/design/delete.service'
import { artboardDesignMoveDownService } from '../services/artboard/design/move-down.service'
import { artboardDesignMoveUpService } from '../services/artboard/design/move-up.service'
import { artboardDesignToggleVisibleService } from '../services/artboard/design/toggle-visible.service'
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

	const { artboardId, type, visibleDesignsCount } = submission.value
	const { success, error } = await artboardDesignCreateService({
		userId,
		artboardId,
		type,
		visibleDesignsCount,
	})

	if (error) return submissionErrorResponse(submission)

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

	const { success, error } =
		direction === 'up'
			? await artboardDesignMoveUpService(args)
			: await artboardDesignMoveDownService(args)

	if (error) return submissionErrorResponse(submission)

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
	const { success, error } = await artboardDesignToggleVisibleService({
		id,
		artboardId,
		updateSelectedDesignId,
	})

	if (error) return submissionErrorResponse(submission)

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
	const { success, error } = await artboardDesignDeleteService({
		id,
		artboardId,
		updateSelectedDesignId,
	})

	if (error) return submissionErrorResponse(submission)

	return json({ status: 'success', submission, success } as const)
}
