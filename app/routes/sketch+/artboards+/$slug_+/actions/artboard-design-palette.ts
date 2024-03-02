import { json } from '@remix-run/node'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { NewArtboardDesignSchema } from '#app/schema/design'
import {
	notSubmissionResponse,
	submissionErrorResponse,
} from '#app/utils/conform-utils'
import { findFirstArtboardInstance } from '#app/utils/prisma-extensions-artboard'
import { parseArtboardSubmission } from './utils'

export async function artboardDesignNewArtboardAction({
	userId,
	formData,
}: IntentActionArgs) {
	// validation
	const submission = await parseArtboardSubmission({
		userId,
		formData,
		schema: NewArtboardDesignSchema,
	})
	if (submission.intent !== 'submit') {
		return notSubmissionResponse(submission)
	}
	if (!submission.value) {
		return submissionErrorResponse(submission)
	}

	// changes
	const { id, width } = submission.value
	const artboard = await findFirstArtboardInstance({
		where: { id, ownerId: userId },
	})
	if (!artboard) return submissionErrorResponse(submission)

	artboard.width = width
	await artboard.save()

	return json({ status: 'success', submission } as const)
}
