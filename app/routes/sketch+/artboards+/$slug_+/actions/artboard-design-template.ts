import { json } from '@remix-run/node'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { EditArtboardTemplateStyleSchema } from '#app/schema/template'
import {
	notSubmissionResponse,
	submissionErrorResponse,
} from '#app/utils/conform-utils'
import { findFirstTemplateInstance } from '#app/utils/prisma-extensions-template'
import { parseArtboardDesignSubmission } from './utils'

export async function artboardDesignEditTemplateStyleAction({
	userId,
	formData,
}: IntentActionArgs) {
	// validation
	const submission = await parseArtboardDesignSubmission({
		userId,
		formData,
		schema: EditArtboardTemplateStyleSchema,
	})

	if (submission.intent !== 'submit') {
		return notSubmissionResponse(submission)
	}
	if (!submission.value) {
		return submissionErrorResponse(submission)
	}

	// changes
	const { id, style } = submission.value
	const template = await findFirstTemplateInstance({
		where: { id },
	})
	if (!template) return submissionErrorResponse(submission)

	template.style = style
	template.updatedAt = new Date()
	await template.save()

	return json({ status: 'success', submission } as const)
}
