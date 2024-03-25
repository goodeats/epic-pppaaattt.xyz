import { json } from '@remix-run/node'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import {
	EditArtboardStrokeBasisSchema,
	EditArtboardStrokeSchema,
	EditArtboardStrokeStyleSchema,
} from '#app/schema/stroke'
import {
	notSubmissionResponse,
	submissionErrorResponse,
} from '#app/utils/conform-utils'
import { findFirstStrokeInstance } from '#app/utils/prisma-extensions-stroke'
import { parseArtboardDesignSubmission } from './utils'

export async function artboardDesignEditStrokeAction({
	userId,
	formData,
}: IntentActionArgs) {
	// validation
	const submission = await parseArtboardDesignSubmission({
		userId,
		formData,
		schema: EditArtboardStrokeSchema,
	})

	if (submission.intent !== 'submit') {
		return notSubmissionResponse(submission)
	}
	if (!submission.value) {
		return submissionErrorResponse(submission)
	}

	// changes
	const { id, value } = submission.value
	const stroke = await findFirstStrokeInstance({
		where: { id },
	})
	if (!stroke) return submissionErrorResponse(submission)

	stroke.value = value
	stroke.updatedAt = new Date()
	await stroke.save()

	return json({ status: 'success', submission } as const)
}

export async function artboardDesignEditStrokeStyleAction({
	userId,
	formData,
}: IntentActionArgs) {
	// validation
	const submission = await parseArtboardDesignSubmission({
		userId,
		formData,
		schema: EditArtboardStrokeStyleSchema,
	})

	if (submission.intent !== 'submit') {
		return notSubmissionResponse(submission)
	}
	if (!submission.value) {
		return submissionErrorResponse(submission)
	}

	// changes
	const { id, style } = submission.value
	const stroke = await findFirstStrokeInstance({
		where: { id },
	})
	if (!stroke) return submissionErrorResponse(submission)

	stroke.style = style
	stroke.updatedAt = new Date()
	await stroke.save()

	return json({ status: 'success', submission } as const)
}

export async function artboardDesignEditStrokeBasisAction({
	userId,
	formData,
}: IntentActionArgs) {
	// validation
	const submission = await parseArtboardDesignSubmission({
		userId,
		formData,
		schema: EditArtboardStrokeBasisSchema,
	})

	if (submission.intent !== 'submit') {
		return notSubmissionResponse(submission)
	}
	if (!submission.value) {
		return submissionErrorResponse(submission)
	}

	// changes
	const { id, basis } = submission.value
	const stroke = await findFirstStrokeInstance({
		where: { id },
	})
	if (!stroke) return submissionErrorResponse(submission)

	stroke.basis = basis
	stroke.updatedAt = new Date()
	await stroke.save()

	return json({ status: 'success', submission } as const)
}
