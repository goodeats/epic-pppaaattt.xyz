import { json } from '@remix-run/node'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { type IStroke } from '#app/models/stroke.server'
import {
	EditDesignStrokeValueSchema,
	EditDesignStrokeBasisSchema,
	EditDesignStrokeStyleSchema,
} from '#app/schema/stroke'
import {
	notSubmissionResponse,
	submissionErrorResponse,
} from '#app/utils/conform-utils'
import { findFirstStrokeInstance } from '#app/utils/prisma-extensions-stroke'
import { parseDesignSubmission } from './utils'

async function validateSubmission({
	userId,
	formData,
	schema,
}: {
	userId: string
	formData: FormData
	schema:
		| typeof EditDesignStrokeValueSchema
		| typeof EditDesignStrokeStyleSchema
		| typeof EditDesignStrokeBasisSchema
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

export async function designStrokeEditValueAction({
	userId,
	formData,
}: IntentActionArgs) {
	const { submission, isValid, response } = await validateSubmission({
		userId,
		formData,
		schema: EditDesignStrokeValueSchema,
	})
	if (!isValid || !submission) return response

	// changes
	const { id, value } = submission.value
	const stroke = await getStroke({ id })
	if (!stroke) return submissionErrorResponse(submission)

	stroke.value = value
	stroke.updatedAt = new Date()
	await stroke.save()

	return json({ status: 'success', submission } as const)
}

export async function designStrokeEditStyleAction({
	userId,
	formData,
}: IntentActionArgs) {
	const { submission, isValid, response } = await validateSubmission({
		userId,
		formData,
		schema: EditDesignStrokeStyleSchema,
	})
	if (!isValid || !submission) return response

	// changes
	const { id, style } = submission.value
	const stroke = await getStroke({ id })
	if (!stroke) return submissionErrorResponse(submission)

	stroke.style = style
	stroke.updatedAt = new Date()
	await stroke.save()

	return json({ status: 'success', submission } as const)
}

export async function designStrokeEditBasisAction({
	userId,
	formData,
}: IntentActionArgs) {
	const { submission, isValid, response } = await validateSubmission({
		userId,
		formData,
		schema: EditDesignStrokeBasisSchema,
	})
	if (!isValid || !submission) return response

	// changes
	const { id, basis } = submission.value
	const stroke = await getStroke({ id })
	if (!stroke) return submissionErrorResponse(submission)

	stroke.basis = basis
	stroke.updatedAt = new Date()
	await stroke.save()

	return json({ status: 'success', submission } as const)
}

const getStroke = async ({ id }: { id: IStroke['id'] }) => {
	return await findFirstStrokeInstance({
		where: { id },
	})
}
