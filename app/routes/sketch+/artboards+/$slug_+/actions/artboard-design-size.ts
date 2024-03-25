import { json } from '@remix-run/node'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { EditArtboardSizeSchema } from '#app/schema/size'
import {
	notSubmissionResponse,
	submissionErrorResponse,
} from '#app/utils/conform-utils'
import { findFirstSizeInstance } from '#app/utils/prisma-extensions-size'
import { parseArtboardDesignSubmission } from './utils'

export async function artboardDesignEditSizeAction({
	userId,
	formData,
}: IntentActionArgs) {
	// validation
	const submission = await parseArtboardDesignSubmission({
		userId,
		formData,
		schema: EditArtboardSizeSchema,
	})

	if (submission.intent !== 'submit') {
		return notSubmissionResponse(submission)
	}
	if (!submission.value) {
		return submissionErrorResponse(submission)
	}

	// changes
	const { id, value } = submission.value
	const size = await findFirstSizeInstance({
		where: { id },
	})
	if (!size) return submissionErrorResponse(submission)

	size.value = value
	size.updatedAt = new Date()
	await size.save()

	return json({ status: 'success', submission } as const)
}
