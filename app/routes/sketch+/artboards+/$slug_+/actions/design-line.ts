import { json } from '@remix-run/node'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { type ILine } from '#app/models/line.server'
import {
	EditDesignLineBasisSchema,
	EditDesignLineFormatSchema,
	EditDesignLineWidthSchema,
} from '#app/schema/line'
import {
	notSubmissionResponse,
	submissionErrorResponse,
} from '#app/utils/conform-utils'
import { findFirstLineInstance } from '#app/utils/prisma-extensions-line'
import { parseDesignSubmission } from './utils'

async function validateSubmission({
	userId,
	formData,
	schema,
}: {
	userId: string
	formData: FormData
	schema:
		| typeof EditDesignLineWidthSchema
		| typeof EditDesignLineFormatSchema
		| typeof EditDesignLineBasisSchema
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

export async function designLineEditWidthAction({
	userId,
	formData,
}: IntentActionArgs) {
	const { submission, isValid, response } = await validateSubmission({
		userId,
		formData,
		schema: EditDesignLineWidthSchema,
	})
	if (!isValid || !submission) return response

	// changes
	const { id, width } = submission.value
	const line = await getLine({ id })
	if (!line) return submissionErrorResponse(submission)

	line.width = width
	line.updatedAt = new Date()
	await line.save()

	return json({ status: 'success', submission } as const)
}

export async function designLineEditFormatAction({
	userId,
	formData,
}: IntentActionArgs) {
	const { submission, isValid, response } = await validateSubmission({
		userId,
		formData,
		schema: EditDesignLineFormatSchema,
	})
	if (!isValid || !submission) return response

	// changes
	const { id, format } = submission.value
	const line = await getLine({ id })
	if (!line) return submissionErrorResponse(submission)

	line.format = format
	line.updatedAt = new Date()
	await line.save()

	return json({ status: 'success', submission } as const)
}

export async function designLineEditBasisAction({
	userId,
	formData,
}: IntentActionArgs) {
	const { submission, isValid, response } = await validateSubmission({
		userId,
		formData,
		schema: EditDesignLineBasisSchema,
	})
	if (!isValid || !submission) return response

	// changes
	const { id, basis } = submission.value
	const line = await getLine({ id })
	if (!line) return submissionErrorResponse(submission)

	line.basis = basis
	line.updatedAt = new Date()
	await line.save()

	return json({ status: 'success', submission } as const)
}

const getLine = async ({ id }: { id: ILine['id'] }) => {
	return await findFirstLineInstance({
		where: { id },
	})
}
