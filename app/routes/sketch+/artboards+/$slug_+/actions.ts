import { type Submission } from '@conform-to/react'
import { parse } from '@conform-to/zod'
import { json } from '@remix-run/node'
import { z } from 'zod'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { findArtboardByIdAndOwner } from '#app/models/artboard.server'
import {
	ArtboardBackgroundColorSchema,
	ArtboardHeightSchema,
	ArtboardWidthSchema,
} from '#app/schema/artboard'
import { findFirstArtboardInstance } from '#app/utils/prisma-extensions-artboard'

const parseArtboardSubmission = async ({
	userId,
	formData,
	schema,
}: IntentActionArgs & { schema: z.ZodSchema<any> }) => {
	return await parse(formData, {
		schema: schema.superRefine(async (data, ctx) => {
			const { id } = data
			const artboard = await findArtboardByIdAndOwner({ id, ownerId: userId })
			if (!artboard) ctx.addIssue(zodArtboardNotFound)
		}),
		async: true,
	})
}
const notSubmissionResponse = (submission: Submission) =>
	json({ status: 'idle', submission } as const)

const submissionErrorResponse = (submission: Submission) =>
	json({ status: 'error', submission } as const, { status: 400 })

const zodArtboardNotFound = {
	code: z.ZodIssueCode.custom,
	message: `Artboard not found`,
}

export async function artboardUpdateWidthAction({
	userId,
	formData,
}: IntentActionArgs) {
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
	console.log('hi')
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
	console.log('hi')
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

	const { id, backgroundColor } = submission.value
	const artboard = await findFirstArtboardInstance({
		where: { id, ownerId: userId },
	})
	if (!artboard) return submissionErrorResponse(submission)

	artboard.backgroundColor = backgroundColor
	await artboard.save()

	return json({ status: 'success', submission } as const)
}
