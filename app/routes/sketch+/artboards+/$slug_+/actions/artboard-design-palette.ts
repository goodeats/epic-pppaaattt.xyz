import { json } from '@remix-run/node'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { EditArtboardPaletteSchema } from '#app/schema/palette'
import {
	notSubmissionResponse,
	submissionErrorResponse,
} from '#app/utils/conform-utils'
import { findFirstPaletteInstance } from '#app/utils/prisma-extensions-palette'
import { parseArtboardDesignSubmission } from './utils'

export async function artboardDesignEditPaletteAction({
	userId,
	formData,
}: IntentActionArgs) {
	// validation
	const submission = await parseArtboardDesignSubmission({
		userId,
		formData,
		schema: EditArtboardPaletteSchema,
	})
	if (submission.intent !== 'submit') {
		return notSubmissionResponse(submission)
	}
	if (!submission.value) {
		return submissionErrorResponse(submission)
	}

	// changes
	const { id, value } = submission.value
	const palette = await findFirstPaletteInstance({
		where: { id },
	})
	if (!palette) return submissionErrorResponse(submission)

	palette.value = value
	palette.updatedAt = new Date()
	await palette.save()

	return json({ status: 'success', submission } as const)
}
