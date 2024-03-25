import { json } from '@remix-run/node'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { type IRotate } from '#app/models/rotate.server'
import {
	EditDesignRotateRotationSchema,
	EditDesignRotateBasisSchema,
} from '#app/schema/rotate'
import {
	notSubmissionResponse,
	submissionErrorResponse,
} from '#app/utils/conform-utils'
import { findFirstRotateInstance } from '#app/utils/prisma-extensions-rotate'
import { parseDesignSubmission } from './utils'

async function validateSubmission({
	userId,
	formData,
	schema,
}: {
	userId: string
	formData: FormData
	schema:
		| typeof EditDesignRotateRotationSchema
		| typeof EditDesignRotateBasisSchema
}) {
	const submission = await parseDesignSubmission({
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

export async function designRotateEditRotationAction({
	userId,
	formData,
}: IntentActionArgs) {
	const { submission, isValid, response } = await validateSubmission({
		userId,
		formData,
		schema: EditDesignRotateRotationSchema,
	})
	if (!isValid || !submission) return response

	// changes
	const { id, rotation } = submission.value
	const rotate = await getRotate({ id })
	if (!rotate) return submissionErrorResponse(submission)

	rotate.rotation = rotation
	rotate.updatedAt = new Date()
	await rotate.save()

	return json({ status: 'success', submission } as const)
}

export async function designRotateEditBasisAction({
	userId,
	formData,
}: IntentActionArgs) {
	const { submission, isValid, response } = await validateSubmission({
		userId,
		formData,
		schema: EditDesignRotateBasisSchema,
	})
	if (!isValid || !submission) return response

	// changes
	const { id, basis } = submission.value
	const rotate = await getRotate({ id })
	if (!rotate) return submissionErrorResponse(submission)

	rotate.basis = basis
	rotate.updatedAt = new Date()
	await rotate.save()

	return json({ status: 'success', submission } as const)
}

const getRotate = async ({ id }: { id: IRotate['id'] }) => {
	return await findFirstRotateInstance({
		where: { id },
	})
}
