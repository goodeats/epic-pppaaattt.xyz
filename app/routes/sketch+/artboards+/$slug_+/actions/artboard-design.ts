import { json } from '@remix-run/node'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import {
	DeleteArtboardDesignSchema,
	ReorderArtboardDesignSchema,
	ToggleVisibilityArtboardDesignSchema,
} from '#app/schema/design'
import {
	notSubmissionResponse,
	submissionErrorResponse,
} from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import { parseArtboardDesignUpdateSubmission } from './utils'

export async function artboardDesignReorderAction({
	userId,
	formData,
}: IntentActionArgs) {
	// validation
	const submission = await parseArtboardDesignUpdateSubmission({
		userId,
		formData,
		schema: ReorderArtboardDesignSchema,
	})
	if (submission.intent !== 'submit') {
		return notSubmissionResponse(submission)
	}
	if (!submission.value) {
		return submissionErrorResponse(submission)
	}

	// changes
	const { id } = submission.value
	try {
		await prisma.$transaction(async prisma => {
			const design = await prisma.design.findFirst({
				where: { id, ownerId: userId },
			})
			if (!design) return submissionErrorResponse(submission)

			// TODO: reorder here
		})
	} catch (error) {
		console.log(error)
		return submissionErrorResponse(submission)
	}

	return json({ status: 'success', submission } as const)
}

export async function artboardDesignToggleVisibilityAction({
	userId,
	formData,
}: IntentActionArgs) {
	// validation
	const submission = await parseArtboardDesignUpdateSubmission({
		userId,
		formData,
		schema: ToggleVisibilityArtboardDesignSchema,
	})
	if (submission.intent !== 'submit') {
		return notSubmissionResponse(submission)
	}
	if (!submission.value) {
		return submissionErrorResponse(submission)
	}

	// changes
	const { id } = submission.value
	try {
		await prisma.$transaction(async prisma => {
			const design = await prisma.design.findFirst({
				where: { id, ownerId: userId },
			})
			if (!design) return submissionErrorResponse(submission)

			await prisma.design.update({
				where: { id },
				data: { visible: !design.visible },
			})
		})
	} catch (error) {
		console.log(error)
		return submissionErrorResponse(submission)
	}

	return json({ status: 'success', submission } as const)
}

export async function artboardDesignDeleteAction({
	userId,
	formData,
}: IntentActionArgs) {
	// validation
	const submission = await parseArtboardDesignUpdateSubmission({
		userId,
		formData,
		schema: DeleteArtboardDesignSchema,
	})
	if (submission.intent !== 'submit') {
		return notSubmissionResponse(submission)
	}
	if (!submission.value) {
		return submissionErrorResponse(submission)
	}

	// changes
	const { id } = submission.value
	try {
		await prisma.$transaction(async prisma => {
			// logic before delete
			// TODO: reorder here if necessary

			// delete design will cascade delete type relation
			await prisma.design.delete({
				where: { id },
			})
		})
	} catch (error) {
		console.log(error)
		return submissionErrorResponse(submission)
	}

	return json({ status: 'success', submission } as const)
}
