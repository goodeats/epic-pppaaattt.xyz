import { json } from '@remix-run/node'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import {
	EditArtboardLayoutColumnsSchema,
	EditArtboardLayoutCountSchema,
	EditArtboardLayoutRowsSchema,
	EditArtboardLayoutStyleSchema,
} from '#app/schema/layout'
import {
	notSubmissionResponse,
	submissionErrorResponse,
} from '#app/utils/conform-utils'
import { findFirstLayoutInstance } from '#app/utils/prisma-extensions-layout'
import { parseArtboardDesignSubmission } from './utils'

export async function artboardDesignEditLayoutStyleAction({
	userId,
	formData,
}: IntentActionArgs) {
	// validation
	const submission = await parseArtboardDesignSubmission({
		userId,
		formData,
		schema: EditArtboardLayoutStyleSchema,
	})

	if (submission.intent !== 'submit') {
		return notSubmissionResponse(submission)
	}
	if (!submission.value) {
		return submissionErrorResponse(submission)
	}

	// changes
	const { id, style } = submission.value
	const layout = await findFirstLayoutInstance({
		where: { id },
	})
	if (!layout) return submissionErrorResponse(submission)

	layout.style = style
	layout.updatedAt = new Date()
	await layout.save()

	return json({ status: 'success', submission } as const)
}

export async function artboardDesignEditLayoutCountAction({
	userId,
	formData,
}: IntentActionArgs) {
	// validation
	const submission = await parseArtboardDesignSubmission({
		userId,
		formData,
		schema: EditArtboardLayoutCountSchema,
	})

	if (submission.intent !== 'submit') {
		return notSubmissionResponse(submission)
	}
	if (!submission.value) {
		return submissionErrorResponse(submission)
	}

	// changes
	const { id, count } = submission.value
	const layout = await findFirstLayoutInstance({
		where: { id },
	})
	if (!layout) return submissionErrorResponse(submission)

	layout.count = count
	layout.updatedAt = new Date()
	await layout.save()

	return json({ status: 'success', submission } as const)
}

export async function artboardDesignEditLayoutRowsAction({
	userId,
	formData,
}: IntentActionArgs) {
	// validation
	const submission = await parseArtboardDesignSubmission({
		userId,
		formData,
		schema: EditArtboardLayoutRowsSchema,
	})

	if (submission.intent !== 'submit') {
		return notSubmissionResponse(submission)
	}
	if (!submission.value) {
		return submissionErrorResponse(submission)
	}

	// changes
	const { id, rows } = submission.value
	const layout = await findFirstLayoutInstance({
		where: { id },
	})
	if (!layout) return submissionErrorResponse(submission)

	layout.rows = rows
	layout.updatedAt = new Date()
	await layout.save()

	return json({ status: 'success', submission } as const)
}

export async function artboardDesignEditLayoutColumnsAction({
	userId,
	formData,
}: IntentActionArgs) {
	// validation
	const submission = await parseArtboardDesignSubmission({
		userId,
		formData,
		schema: EditArtboardLayoutColumnsSchema,
	})

	if (submission.intent !== 'submit') {
		return notSubmissionResponse(submission)
	}
	if (!submission.value) {
		return submissionErrorResponse(submission)
	}

	// changes
	const { id, columns } = submission.value
	const layout = await findFirstLayoutInstance({
		where: { id },
	})
	if (!layout) return submissionErrorResponse(submission)

	layout.columns = columns
	layout.updatedAt = new Date()
	await layout.save()

	return json({ status: 'success', submission } as const)
}
