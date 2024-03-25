import { json } from '@remix-run/node'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import {
	DeleteArtboardLayerSchema,
	NewArtboardLayerSchema,
	ReorderArtboardLayerSchema,
	ToggleVisibleArtboardLayerSchema,
} from '#app/schema/layer-artboard'
import {
	notSubmissionResponse,
	submissionErrorResponse,
} from '#app/utils/conform-utils'
import { artboardLayerCreateService } from '../services/artboard/layer/create.service'
import { artboardLayerDeleteService } from '../services/artboard/layer/delete.service'
import { artboardLayerMoveDownService } from '../services/artboard/layer/move-down.service'
import { artboardLayerMoveUpService } from '../services/artboard/layer/move-up.service'
import { artboardLayerToggleVisibleService } from '../services/artboard/layer/toggle-visible.service'
import {
	parseArtboardLayerSubmission,
	parseArtboardLayerUpdateSubmission,
} from './utils'

async function validateSubmission({
	userId,
	formData,
	schema,
}: {
	userId: string
	formData: FormData
	schema:
		| typeof NewArtboardLayerSchema
		| typeof ReorderArtboardLayerSchema
		| typeof ToggleVisibleArtboardLayerSchema
		| typeof DeleteArtboardLayerSchema
}) {
	const newDesign = schema === NewArtboardLayerSchema
	const submission = newDesign
		? await parseArtboardLayerSubmission({ userId, formData, schema })
		: await parseArtboardLayerUpdateSubmission({ userId, formData, schema })

	if (submission.intent !== 'submit') {
		return { response: notSubmissionResponse(submission), isValid: false }
	}
	if (!submission.value) {
		return { response: submissionErrorResponse(submission), isValid: false }
	}

	return { submission, isValid: true }
}

export async function artboardLayerNewAction({
	userId,
	formData,
}: IntentActionArgs) {
	const { submission, isValid, response } = await validateSubmission({
		userId,
		formData,
		schema: NewArtboardLayerSchema,
	})
	if (!isValid || !submission) return response

	const { artboardId } = submission.value
	const { success, error } = await artboardLayerCreateService({
		userId,
		artboardId,
	})

	if (error) return submissionErrorResponse(submission)

	return json({ status: 'success', submission, success } as const)
}

export async function artboardLayerReorderAction({
	userId,
	formData,
}: IntentActionArgs) {
	const { submission, isValid, response } = await validateSubmission({
		userId,
		formData,
		schema: ReorderArtboardLayerSchema,
	})
	if (!isValid || !submission) return response

	const { id, artboardId, direction } = submission.value
	const args = {
		userId,
		id,
		artboardId,
	}

	const { success, error } =
		direction === 'up'
			? await artboardLayerMoveUpService(args)
			: await artboardLayerMoveDownService(args)

	if (error) return submissionErrorResponse(submission)

	return json({ status: 'success', submission, success } as const)
}

export async function artboardLayerToggleVisibleAction({
	userId,
	formData,
}: IntentActionArgs) {
	const { submission, isValid, response } = await validateSubmission({
		userId,
		formData,
		schema: ToggleVisibleArtboardLayerSchema,
	})
	if (!isValid || !submission) return response

	const { id, artboardId } = submission.value
	const { success, error } = await artboardLayerToggleVisibleService({
		userId,
		id,
		artboardId,
	})

	if (error) return submissionErrorResponse(submission)

	return json({ status: 'success', submission, success } as const)
}

export async function artboardLayerDeleteAction({
	userId,
	formData,
}: IntentActionArgs) {
	const { submission, isValid, response } = await validateSubmission({
		userId,
		formData,
		schema: DeleteArtboardLayerSchema,
	})
	if (!isValid || !submission) return response

	const { id, artboardId } = submission.value
	const { success, error } = await artboardLayerDeleteService({
		userId,
		id,
		artboardId,
	})

	if (error) return submissionErrorResponse(submission)

	return json({ status: 'success', submission, success } as const)
}
