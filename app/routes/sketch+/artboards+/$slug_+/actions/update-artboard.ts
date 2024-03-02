import { json } from '@remix-run/node'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import {
	ArtboardBackgroundColorSchema,
	ArtboardHeightSchema,
	ArtboardWidthSchema,
} from '#app/schema/artboard'
import {
	notSubmissionResponse,
	submissionErrorResponse,
} from '#app/utils/conform-utils'
import { findFirstArtboardInstance } from '#app/utils/prisma-extensions-artboard'
import { parseArtboardSubmission } from './utils'

export async function artboardUpdateWidthAction({
	userId,
	formData,
}: IntentActionArgs) {
	// validation
	const submission = await parseArtboardSubmission({
		userId,
		formData,
		schema: ArtboardWidthSchema,
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

export async function artboardUpdateHeightAction({
	userId,
	formData,
}: IntentActionArgs) {
	// validation
	const submission = await parseArtboardSubmission({
		userId,
		formData,
		schema: ArtboardHeightSchema,
	})
	if (submission.intent !== 'submit') {
		return notSubmissionResponse(submission)
	}
	if (!submission.value) {
		return submissionErrorResponse(submission)
	}

	// changes
	const { id, height } = submission.value
	const artboard = await findFirstArtboardInstance({
		where: { id, ownerId: userId },
	})
	if (!artboard) return submissionErrorResponse(submission)

	artboard.height = height
	await artboard.save()

	return json({ status: 'success', submission } as const)
}

export async function artboardUpdateBackgroundColorAction({
	userId,
	formData,
}: IntentActionArgs) {
	// validation
	const submission = await parseArtboardSubmission({
		userId,
		formData,
		schema: ArtboardBackgroundColorSchema,
	})
	if (submission.intent !== 'submit') {
		return notSubmissionResponse(submission)
	}
	if (!submission.value) {
		return submissionErrorResponse(submission)
	}

	// changes
	const { id, backgroundColor } = submission.value
	const artboard = await findFirstArtboardInstance({
		where: { id, ownerId: userId },
	})
	if (!artboard) return submissionErrorResponse(submission)

	artboard.backgroundColor = backgroundColor
	await artboard.save()

	return json({ status: 'success', submission } as const)
}
