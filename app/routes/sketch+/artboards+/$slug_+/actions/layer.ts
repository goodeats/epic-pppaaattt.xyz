import { json } from '@remix-run/node'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { type ILayer } from '#app/models/layer.server'
import {
	EditLayerDescriptionSchema,
	EditLayerNameSchema,
} from '#app/schema/layer'
import {
	notSubmissionResponse,
	submissionErrorResponse,
} from '#app/utils/conform-utils'
import { findFirstLayerInstance } from '#app/utils/prisma-extensions-layer'
import { parseLayerSubmission } from './utils'

async function validateSubmission({
	userId,
	formData,
	schema,
}: {
	userId: string
	formData: FormData
	schema: typeof EditLayerNameSchema | typeof EditLayerDescriptionSchema
}) {
	const submission = await parseLayerSubmission({
		userId,
		formData,
		schema,
	})

	if (submission.intent !== 'submit') {
		return { response: notSubmissionResponse(submission), isValid: false }
	}
	if (!submission.value) {
		return { response: submissionErrorResponse(submission), isValid: false }
	}

	return { submission, isValid: true }
}

export async function layerEditNameAction({
	userId,
	formData,
}: IntentActionArgs) {
	const { submission, isValid, response } = await validateSubmission({
		userId,
		formData,
		schema: EditLayerNameSchema,
	})
	if (!isValid || !submission) return response

	// changes
	const { id, name } = submission.value
	const layer = await getLayer({ id })
	if (!layer) return submissionErrorResponse(submission)

	layer.name = name
	layer.updatedAt = new Date()
	await layer.save()

	return json({ status: 'success', submission } as const)
}

export async function layerEditDescriptionAction({
	userId,
	formData,
}: IntentActionArgs) {
	const { submission, isValid, response } = await validateSubmission({
		userId,
		formData,
		schema: EditLayerDescriptionSchema,
	})
	if (!isValid || !submission) return response

	// changes
	const { id, description } = submission.value
	const layer = await getLayer({ id })
	if (!layer) return submissionErrorResponse(submission)

	layer.description = description ?? ''
	layer.updatedAt = new Date()
	await layer.save()

	return json({ status: 'success', submission } as const)
}

const getLayer = async ({ id }: { id: ILayer['id'] }) => {
	return await findFirstLayerInstance({
		where: { id },
	})
}
