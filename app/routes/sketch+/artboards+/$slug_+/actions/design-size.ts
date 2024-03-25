import { json } from '@remix-run/node'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { type ISize } from '#app/models/size.server'
import { EditDesignSizeValueSchema } from '#app/schema/size'
import {
	notSubmissionResponse,
	submissionErrorResponse,
} from '#app/utils/conform-utils'
import { findFirstSizeInstance } from '#app/utils/prisma-extensions-size'
import { parseDesignSubmission } from './utils'

async function validateSubmission({
	userId,
	formData,
	schema,
}: {
	userId: string
	formData: FormData
	schema: typeof EditDesignSizeValueSchema
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

export async function designSizeEditValueAction({
	userId,
	formData,
}: IntentActionArgs) {
	const { submission, isValid, response } = await validateSubmission({
		userId,
		formData,
		schema: EditDesignSizeValueSchema,
	})
	if (!isValid || !submission) return response

	// changes
	const { id, value } = submission.value
	const size = await getSize({ id })
	if (!size) return submissionErrorResponse(submission)

	size.value = value
	size.updatedAt = new Date()
	await size.save()

	return json({ status: 'success', submission } as const)
}

const getSize = async ({ id }: { id: ISize['id'] }) => {
	return await findFirstSizeInstance({
		where: { id },
	})
}
