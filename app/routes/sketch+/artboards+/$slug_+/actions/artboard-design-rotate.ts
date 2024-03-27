import { json } from '@remix-run/node'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import {
	EditArtboardRotateBasisSchema,
	EditArtboardRotateSchema,
} from '#app/schema/rotate'
import {
	notSubmissionResponse,
	submissionErrorResponse,
} from '#app/utils/conform-utils'
import { findFirstRotateInstance } from '#app/utils/prisma-extensions-rotate'
import { parseArtboardDesignSubmission } from './utils'

export async function artboardDesignEditRotateAction({
	userId,
	formData,
}: IntentActionArgs) {
	// validation
	const submission = await parseArtboardDesignSubmission({
		userId,
		formData,
		schema: EditArtboardRotateSchema,
	})

	if (submission.intent !== 'submit') {
		return notSubmissionResponse(submission)
	}
	if (!submission.value) {
		return submissionErrorResponse(submission)
	}

	// changes
	const { id, value } = submission.value
	const rotate = await findFirstRotateInstance({
		where: { id },
	})
	if (!rotate) return submissionErrorResponse(submission)

	rotate.value = value
	rotate.updatedAt = new Date()
	await rotate.save()

	return json({ status: 'success', submission } as const)
}

export async function artboardDesignEditRotateBasisAction({
	userId,
	formData,
}: IntentActionArgs) {
	// validation
	const submission = await parseArtboardDesignSubmission({
		userId,
		formData,
		schema: EditArtboardRotateBasisSchema,
	})

	if (submission.intent !== 'submit') {
		return notSubmissionResponse(submission)
	}
	if (!submission.value) {
		return submissionErrorResponse(submission)
	}

	// changes
	const { id, basis } = submission.value
	const rotate = await findFirstRotateInstance({
		where: { id },
	})
	if (!rotate) return submissionErrorResponse(submission)

	rotate.basis = basis
	rotate.updatedAt = new Date()
	await rotate.save()

	return json({ status: 'success', submission } as const)
}
