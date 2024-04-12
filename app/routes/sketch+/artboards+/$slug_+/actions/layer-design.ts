import { json } from '@remix-run/node'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import {
	DeleteLayerDesignSchema,
	NewLayerDesignSchema,
	ReorderLayerDesignSchema,
	ToggleVisibleLayerDesignSchema,
} from '#app/schema/design-layer'
import {
	notSubmissionResponse,
	submissionErrorResponse,
} from '#app/utils/conform-utils'
import { layerDesignCreateService } from '../services/layer/design/create.service'
import { layerDesignDeleteService } from '../services/layer/design/delete.service'
import { layerDesignMoveDownService } from '../services/layer/design/move-down.service'
import { layerDesignMoveUpService } from '../services/layer/design/move-up.service'
import { layerDesignToggleVisibleService } from '../services/layer/design/toggle-visible.service'
import {
	parseLayerDesignSubmission,
	parseLayerDesignUpdateSubmission,
} from './utils'

async function validateSubmission({
	userId,
	formData,
	schema,
}: {
	userId: string
	formData: FormData
	schema:
		| typeof NewLayerDesignSchema
		| typeof ReorderLayerDesignSchema
		| typeof ToggleVisibleLayerDesignSchema
		| typeof DeleteLayerDesignSchema
}) {
	const newDesign = schema === NewLayerDesignSchema
	const submission = newDesign
		? await parseLayerDesignSubmission({ userId, formData, schema })
		: await parseLayerDesignUpdateSubmission({ userId, formData, schema })

	if (submission.intent !== 'submit') {
		return { response: notSubmissionResponse(submission), isValid: false }
	}
	if (!submission.value) {
		return { response: submissionErrorResponse(submission), isValid: false }
	}

	return { submission, isValid: true }
}

export async function layerDesignNewAction({
	userId,
	formData,
}: IntentActionArgs) {
	const { submission, isValid, response } = await validateSubmission({
		userId,
		formData,
		schema: NewLayerDesignSchema,
	})
	if (!isValid || !submission) return response

	const { layerId, type } = submission.value
	const { success } = await layerDesignCreateService({
		userId,
		layerId,
		type,
	})

	if (!success) return submissionErrorResponse(submission)

	return json({ status: 'success', submission, success } as const)
}

export async function layerDesignReorderAction({
	userId,
	formData,
}: IntentActionArgs) {
	const { submission, isValid, response } = await validateSubmission({
		userId,
		formData,
		schema: ReorderLayerDesignSchema,
	})
	if (!isValid || !submission) return response

	const { id, layerId, direction, updateSelectedDesignId } = submission.value
	const args = {
		userId,
		id,
		layerId,
		updateSelectedDesignId,
	}

	const { success, error } =
		direction === 'up'
			? await layerDesignMoveUpService(args)
			: await layerDesignMoveDownService(args)

	if (error) return submissionErrorResponse(submission)

	return json({ status: 'success', submission, success } as const)
}

export async function layerDesignToggleVisibleAction({
	userId,
	formData,
}: IntentActionArgs) {
	const { submission, isValid, response } = await validateSubmission({
		userId,
		formData,
		schema: ToggleVisibleLayerDesignSchema,
	})
	if (!isValid || !submission) return response

	const { id, layerId, updateSelectedDesignId } = submission.value
	const { success, error } = await layerDesignToggleVisibleService({
		userId,
		id,
		layerId,
		updateSelectedDesignId,
	})

	if (error) return submissionErrorResponse(submission)

	return json({ status: 'success', submission, success } as const)
}

export async function layerDesignDeleteAction({
	userId,
	formData,
}: IntentActionArgs) {
	const { submission, isValid, response } = await validateSubmission({
		userId,
		formData,
		schema: DeleteLayerDesignSchema,
	})
	if (!isValid || !submission) return response

	const { id, layerId, updateSelectedDesignId } = submission.value
	const { success, error } = await layerDesignDeleteService({
		userId,
		id,
		layerId,
		updateSelectedDesignId,
	})

	if (error) return submissionErrorResponse(submission)

	return json({ status: 'success', submission, success } as const)
}
