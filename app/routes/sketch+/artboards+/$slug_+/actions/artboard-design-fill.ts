import { json } from '@remix-run/node'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import {
	EditArtboardFillBasisSchema,
	EditArtboardFillSchema,
	EditArtboardFillStyleSchema,
} from '#app/schema/fill'
import {
	notSubmissionResponse,
	submissionErrorResponse,
} from '#app/utils/conform-utils'
import { findFirstFillInstance } from '#app/utils/prisma-extensions-fill'
import { parseArtboardDesignSubmission } from './utils'

export async function artboardDesignEditFillAction({
	userId,
	formData,
}: IntentActionArgs) {
	// validation
	const submission = await parseArtboardDesignSubmission({
		userId,
		formData,
		schema: EditArtboardFillSchema,
	})

	if (submission.intent !== 'submit') {
		return notSubmissionResponse(submission)
	}
	if (!submission.value) {
		return submissionErrorResponse(submission)
	}

	// changes
	const { id, value } = submission.value
	const fill = await findFirstFillInstance({
		where: { id },
	})
	if (!fill) return submissionErrorResponse(submission)

	fill.value = value
	fill.updatedAt = new Date()
	await fill.save()

	return json({ status: 'success', submission } as const)
}

export async function artboardDesignEditFillStyleAction({
	userId,
	formData,
}: IntentActionArgs) {
	// validation
	const submission = await parseArtboardDesignSubmission({
		userId,
		formData,
		schema: EditArtboardFillStyleSchema,
	})

	if (submission.intent !== 'submit') {
		return notSubmissionResponse(submission)
	}
	if (!submission.value) {
		return submissionErrorResponse(submission)
	}

	// changes
	const { id, style } = submission.value
	const fill = await findFirstFillInstance({
		where: { id },
	})
	if (!fill) return submissionErrorResponse(submission)

	fill.style = style
	fill.updatedAt = new Date()
	await fill.save()

	return json({ status: 'success', submission } as const)
}

export async function artboardDesignEditFillBasisAction({
	userId,
	formData,
}: IntentActionArgs) {
	// validation
	const submission = await parseArtboardDesignSubmission({
		userId,
		formData,
		schema: EditArtboardFillBasisSchema,
	})

	if (submission.intent !== 'submit') {
		return notSubmissionResponse(submission)
	}
	if (!submission.value) {
		return submissionErrorResponse(submission)
	}

	// changes
	const { id, basis } = submission.value
	const fill = await findFirstFillInstance({
		where: { id },
	})
	if (!fill) return submissionErrorResponse(submission)

	fill.basis = basis
	fill.updatedAt = new Date()
	await fill.save()

	return json({ status: 'success', submission } as const)
}
