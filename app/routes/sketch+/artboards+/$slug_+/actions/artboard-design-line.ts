import { json } from '@remix-run/node'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { EditArtboardLineWidthSchema } from '#app/schema/line'
import {
	notSubmissionResponse,
	submissionErrorResponse,
} from '#app/utils/conform-utils'
import { findFirstLineInstance } from '#app/utils/prisma-extensions-line'
import { parseArtboardDesignSubmission } from './utils'

export async function artboardDesignEditLineWidthAction({
	userId,
	formData,
}: IntentActionArgs) {
	// validation
	const submission = await parseArtboardDesignSubmission({
		userId,
		formData,
		schema: EditArtboardLineWidthSchema,
	})

	if (submission.intent !== 'submit') {
		return notSubmissionResponse(submission)
	}
	if (!submission.value) {
		return submissionErrorResponse(submission)
	}

	// changes
	const { id, width } = submission.value
	const line = await findFirstLineInstance({
		where: { id },
	})
	if (!line) return submissionErrorResponse(submission)

	line.width = width
	line.updatedAt = new Date()
	await line.save()

	return json({ status: 'success', submission } as const)
}
