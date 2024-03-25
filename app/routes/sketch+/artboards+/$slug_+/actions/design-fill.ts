import { json } from '@remix-run/node'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { type IFill } from '#app/models/fill.server'
import {
	EditDesignFillValueSchema,
	EditDesignFillBasisSchema,
	EditDesignFillStyleSchema,
} from '#app/schema/fill'
import {
	notSubmissionResponse,
	submissionErrorResponse,
} from '#app/utils/conform-utils'
import { findFirstFillInstance } from '#app/utils/prisma-extensions-fill'
import { parseDesignSubmission } from './utils'

async function validateSubmission({
	userId,
	formData,
	schema,
}: {
	userId: string
	formData: FormData
	schema:
		| typeof EditDesignFillValueSchema
		| typeof EditDesignFillStyleSchema
		| typeof EditDesignFillBasisSchema
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

export async function designFillEditValueAction({
	userId,
	formData,
}: IntentActionArgs) {
	const { submission, isValid, response } = await validateSubmission({
		userId,
		formData,
		schema: EditDesignFillValueSchema,
	})
	if (!isValid || !submission) return response

	// changes
	const { id, value } = submission.value
	const fill = await getFill({ id })
	if (!fill) return submissionErrorResponse(submission)

	fill.value = value
	fill.updatedAt = new Date()
	await fill.save()

	return json({ status: 'success', submission } as const)
}

export async function designFillEditStyleAction({
	userId,
	formData,
}: IntentActionArgs) {
	const { submission, isValid, response } = await validateSubmission({
		userId,
		formData,
		schema: EditDesignFillStyleSchema,
	})
	if (!isValid || !submission) return response

	// changes
	const { id, style } = submission.value
	const fill = await getFill({ id })
	if (!fill) return submissionErrorResponse(submission)

	fill.style = style
	fill.updatedAt = new Date()
	await fill.save()

	return json({ status: 'success', submission } as const)
}

export async function designFillEditBasisAction({
	userId,
	formData,
}: IntentActionArgs) {
	const { submission, isValid, response } = await validateSubmission({
		userId,
		formData,
		schema: EditDesignFillBasisSchema,
	})
	if (!isValid || !submission) return response

	// changes
	const { id, basis } = submission.value
	const fill = await getFill({ id })
	if (!fill) return submissionErrorResponse(submission)

	fill.basis = basis
	fill.updatedAt = new Date()
	await fill.save()

	return json({ status: 'success', submission } as const)
}

const getFill = async ({ id }: { id: IFill['id'] }) => {
	return await findFirstFillInstance({
		where: { id },
	})
}
