import { json } from '@remix-run/node'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { type ITemplate } from '#app/models/template.server'
import { EditDesignTemplateStyleSchema } from '#app/schema/template'
import {
	notSubmissionResponse,
	submissionErrorResponse,
} from '#app/utils/conform-utils'
import { findFirstTemplateInstance } from '#app/utils/prisma-extensions-template'
import { parseDesignSubmission } from './utils'

async function validateSubmission({
	userId,
	formData,
	schema,
}: {
	userId: string
	formData: FormData
	schema: typeof EditDesignTemplateStyleSchema
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

export async function designTemplateEditStyleAction({
	userId,
	formData,
}: IntentActionArgs) {
	const { submission, isValid, response } = await validateSubmission({
		userId,
		formData,
		schema: EditDesignTemplateStyleSchema,
	})
	if (!isValid || !submission) return response

	// changes
	const { id, style } = submission.value
	const template = await getTemplate({ id })
	if (!template) return submissionErrorResponse(submission)

	template.style = style
	template.updatedAt = new Date()
	await template.save()

	return json({ status: 'success', submission } as const)
}

const getTemplate = async ({ id }: { id: ITemplate['id'] }) => {
	return await findFirstTemplateInstance({
		where: { id },
	})
}
