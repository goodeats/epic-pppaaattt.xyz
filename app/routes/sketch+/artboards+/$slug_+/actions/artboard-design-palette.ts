import { json } from '@remix-run/node'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { NewArtboardDesignSchema, designSchema } from '#app/schema/design'
import {
	DeleteArtboardPaletteSchema,
	EditArtboardPaletteSchema,
} from '#app/schema/palette'
import {
	notSubmissionResponse,
	submissionErrorResponse,
} from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import { findFirstPaletteInstance } from '#app/utils/prisma-extensions-palette'
import { parseArtboardDesignSubmission } from './utils'

export async function artboardDesignNewPaletteAction({
	userId,
	formData,
}: IntentActionArgs) {
	// validation
	const submission = await parseArtboardDesignSubmission({
		userId,
		formData,
		schema: NewArtboardDesignSchema,
	})
	if (submission.intent !== 'submit') {
		return notSubmissionResponse(submission)
	}
	if (!submission.value) {
		return submissionErrorResponse(submission)
	}

	// changes
	const { artboardId } = submission.value

	// start transaction so we can create design and palette together
	// palette is 1:1 with design which belongs to an artboard
	try {
		await prisma.$transaction(async prisma => {
			// create design first
			const designData = designSchema.parse({
				type: 'palette',
				ownerId: userId,
				artboardId,
			})
			const design = await prisma.design.create({
				data: designData,
			})

			// then create palette
			await prisma.palette.create({
				data: {
					designId: design.id,
				},
			})
		})
	} catch (error) {
		console.log(error)
		return submissionErrorResponse(submission)
	}

	return json({ status: 'success', submission } as const)
}

export async function artboardDesignEditPaletteAction({
	userId,
	formData,
}: IntentActionArgs) {
	// validation
	const submission = await parseArtboardDesignSubmission({
		userId,
		formData,
		schema: EditArtboardPaletteSchema,
	})
	if (submission.intent !== 'submit') {
		return notSubmissionResponse(submission)
	}
	if (!submission.value) {
		return submissionErrorResponse(submission)
	}

	// changes
	const { id, value } = submission.value
	const palette = await findFirstPaletteInstance({
		where: { id },
	})
	if (!palette) return submissionErrorResponse(submission)

	palette.value = value
	palette.updatedAt = new Date()
	await palette.save()

	return json({ status: 'success', submission } as const)
}

export async function artboardDesignDeletePaletteAction({
	userId,
	formData,
}: IntentActionArgs) {
	// validation
	const submission = await parseArtboardDesignSubmission({
		userId,
		formData,
		schema: DeleteArtboardPaletteSchema,
	})
	if (submission.intent !== 'submit') {
		return notSubmissionResponse(submission)
	}
	if (!submission.value) {
		return submissionErrorResponse(submission)
	}

	// changes
	const { designId } = submission.value
	// start transaction so we can delete design and palette together
	// palette is 1:1 with design which belongs to an artboard
	try {
		await prisma.$transaction(async prisma => {
			// logic before delete

			// delete design will cascade delete palette
			await prisma.design.deleteMany({
				where: { id: designId },
			})
		})
	} catch (error) {
		console.log(error)
		return submissionErrorResponse(submission)
	}

	return json({ status: 'success', submission } as const)
}
