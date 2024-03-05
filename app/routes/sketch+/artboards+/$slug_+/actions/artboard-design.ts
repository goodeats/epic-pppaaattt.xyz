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
			// find design first
			const design = await prisma.design.findFirst({
				where: { id },
			})
			if (!design) return submissionErrorResponse(submission)

			// delete design will cascade delete type relation
			await prisma.design.delete({
				where: { id },
			})

			// if design is the only design in the artboard
			if (!design.prevId && !design.nextId) return

			if (!design.prevId && design.nextId) {
				// if head
				// remove prevId from next design, becomes head
				await prisma.design.update({
					where: { id: design.nextId },
					data: { prevId: null },
				})
			} else if (design.prevId && !design.nextId) {
				// if tail
				// remove nextId from prev design, becomes tail
				await prisma.design.update({
					where: { id: design.prevId },
					data: { nextId: null },
				})
			} else if (design.prevId && design.nextId) {
				// if in middle
				// replace nextId for prev design with nextId of deleted design
				await prisma.design.update({
					where: { id: design.prevId },
					data: { nextId: design.nextId },
				})
				// replace prevId for next design with prevId of deleted design
				await prisma.design.update({
					where: { id: design.nextId },
					data: { prevId: design.prevId },
				})
			}
		})
	} catch (error) {
		console.log(error)
		return submissionErrorResponse(submission)
	}

	return json({ status: 'success', submission } as const)
}
