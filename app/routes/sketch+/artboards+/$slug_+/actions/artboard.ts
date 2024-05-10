import { json } from '@remix-run/node'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { type IArtboard } from '#app/models/artboard/artboard.server'
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

async function validateSubmission({
	userId,
	formData,
	schema,
}: {
	userId: string
	formData: FormData
	schema:
		| typeof ArtboardWidthSchema
		| typeof ArtboardHeightSchema
		| typeof ArtboardBackgroundColorSchema
}) {
	const submission = await parseArtboardSubmission({
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

export async function artboardEditWidthAction({
	userId,
	formData,
}: IntentActionArgs) {
	const { submission, isValid, response } = await validateSubmission({
		userId,
		formData,
		schema: ArtboardWidthSchema,
	})
	if (!isValid || !submission) return response

	// changes
	const { id, width } = submission.value
	const artboard = await getArtboard({ id })
	if (!artboard) return submissionErrorResponse(submission)

	artboard.width = width
	artboard.updatedAt = new Date()
	await artboard.save()

	return json({ status: 'success', submission } as const)
}

export async function artboardEditHeightAction({
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
	const artboard = await getArtboard({ id })
	if (!artboard) return submissionErrorResponse(submission)

	artboard.height = height
	artboard.updatedAt = new Date()
	await artboard.save()

	return json({ status: 'success', submission } as const)
}

export async function artboardEditBackgroundColorAction({
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
	const artboard = await getArtboard({ id })
	if (!artboard) return submissionErrorResponse(submission)

	artboard.backgroundColor = backgroundColor
	artboard.updatedAt = new Date()
	await artboard.save()

	return json({ status: 'success', submission } as const)
}

const getArtboard = async ({ id }: { id: IArtboard['id'] }) => {
	return await findFirstArtboardInstance({
		where: { id },
	})
}
