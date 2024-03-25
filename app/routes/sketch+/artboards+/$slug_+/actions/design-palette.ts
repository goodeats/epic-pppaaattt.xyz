import { json } from '@remix-run/node'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { type IPalette } from '#app/models/palette.server'
import { EditDesignPaletteValueSchema } from '#app/schema/palette'
import {
	notSubmissionResponse,
	submissionErrorResponse,
} from '#app/utils/conform-utils'
import { findFirstPaletteInstance } from '#app/utils/prisma-extensions-palette'
import { parseDesignSubmission } from './utils'

async function validateSubmission({
	userId,
	formData,
	schema,
}: {
	userId: string
	formData: FormData
	schema: typeof EditDesignPaletteValueSchema
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

export async function designPaletteEditValueAction({
	userId,
	formData,
}: IntentActionArgs) {
	const { submission, isValid, response } = await validateSubmission({
		userId,
		formData,
		schema: EditDesignPaletteValueSchema,
	})
	if (!isValid || !submission) return response

	// changes
	const { id, value } = submission.value
	const palette = await getPalette({ id })
	if (!palette) return submissionErrorResponse(submission)

	palette.value = value
	palette.updatedAt = new Date()
	await palette.save()

	return json({ status: 'success', submission } as const)
}

const getPalette = async ({ id }: { id: IPalette['id'] }) => {
	return await findFirstPaletteInstance({
		where: { id },
	})
}
