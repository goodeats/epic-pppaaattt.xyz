import { json } from '@remix-run/node'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { NewArtboardDesignSchema, designSchema } from '#app/schema/design'
import {
	EditArtboardFillBasisSchema,
	EditArtboardFillStyleSchema,
} from '#app/schema/fill'
import { EditArtboardStrokeSchema } from '#app/schema/stroke'
import {
	notSubmissionResponse,
	submissionErrorResponse,
} from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import { findFirstFillInstance } from '#app/utils/prisma-extensions-fill'
import { findFirstStrokeInstance } from '#app/utils/prisma-extensions-stroke'
import { parseArtboardDesignSubmission } from './utils'

export async function artboardDesignNewStrokeAction({
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

	// start transaction so we can create design and stroke together
	// stroke is 1:1 with design which belongs to an artboard
	try {
		await prisma.$transaction(async prisma => {
			// new designs are appended to the end of the list
			// find the last design in the list by type
			// we know the artboard already exists for the user by this point
			const lastArtboardDesignStroke = await prisma.design.findFirst({
				where: { type: 'stroke', artboardId, nextId: null },
			})

			// create design before stroke
			const designData = designSchema.parse({
				type: 'stroke',
				ownerId: userId,
				artboardId,
			})
			const design = await prisma.design.create({
				data: designData,
			})

			// then create stroke after design
			await prisma.stroke.create({
				data: {
					designId: design.id,
				},
			})

			// if the artboard already has a stroke
			// link the new stroke to the last one
			// and the last one to the new one
			if (lastArtboardDesignStroke) {
				await prisma.design.update({
					where: { id: design.id },
					data: { prevId: lastArtboardDesignStroke.id },
				})

				await prisma.design.update({
					where: { id: lastArtboardDesignStroke.id },
					data: { nextId: design.id },
				})
			}
		})
	} catch (error) {
		console.log(error)
		return submissionErrorResponse(submission)
	}

	return json({ status: 'success', submission } as const)
}

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
	const stroke = await findFirstFillInstance({
		where: { id },
	})
	if (!stroke) return submissionErrorResponse(submission)

	stroke.style = style
	stroke.updatedAt = new Date()
	await stroke.save()

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
	const stroke = await findFirstFillInstance({
		where: { id },
	})
	if (!stroke) return submissionErrorResponse(submission)

	stroke.basis = basis
	stroke.updatedAt = new Date()
	await stroke.save()

	return json({ status: 'success', submission } as const)
}
