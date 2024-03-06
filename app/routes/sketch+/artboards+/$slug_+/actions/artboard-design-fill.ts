import { json } from '@remix-run/node'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import {
	ArtboardSelectedDesignsSchema,
	type ArtboardSelectedDesignsType,
} from '#app/schema/artboard'
import { NewArtboardDesignSchema, designSchema } from '#app/schema/design'
import {
	EditArtboardFillBasisSchema,
	EditArtboardFillSchema,
	EditArtboardFillStyleSchema,
} from '#app/schema/fill'
import {
	notSubmissionResponse,
	submissionErrorResponse,
} from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import { findFirstFillInstance } from '#app/utils/prisma-extensions-fill'
import { parseArtboardDesignSubmission } from './utils'

export async function artboardDesignNewFillAction({
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

	// start transaction so we can create design and fill together
	// fill is 1:1 with design which belongs to an artboard
	try {
		await prisma.$transaction(async prisma => {
			// new designs are appended to the end of the list
			// find the last design in the list by type
			// we know the artboard already exists for the user by this point
			const lastArtboardDesignFill = await prisma.design.findFirst({
				where: { type: 'fill', artboardId, nextId: null },
			})

			// create design before fill
			const designData = designSchema.parse({
				type: 'fill',
				ownerId: userId,
				artboardId,
			})
			const design = await prisma.design.create({
				data: designData,
			})

			// then create fill after design
			await prisma.fill.create({
				data: {
					designId: design.id,
				},
			})

			// if the artboard already has a fill
			// link the new fill to the last one
			// and the last one to the new one
			if (lastArtboardDesignFill) {
				await prisma.design.update({
					where: { id: design.id },
					data: { prevId: lastArtboardDesignFill.id },
				})

				await prisma.design.update({
					where: { id: lastArtboardDesignFill.id },
					data: { nextId: design.id },
				})
			} else {
				// set selectedDesign for the artboard
				// get the selectedDesigns from the artboard
				const artboard = await prisma.artboard.findFirst({
					where: { id: artboardId },
					select: { selectedDesigns: true },
				})
				if (!artboard) return submissionErrorResponse(submission)

				// parse the selectedDesigns and update the paletteId
				const selectedDesigns = ArtboardSelectedDesignsSchema.parse(
					JSON.parse(artboard.selectedDesigns),
				) as ArtboardSelectedDesignsType
				const updatedSelectedDesigns = ArtboardSelectedDesignsSchema.parse({
					...selectedDesigns,
					fillId: design.id,
				})

				// update the selectedDesigns for the artboard
				await prisma.artboard.update({
					where: { id: artboardId },
					data: { selectedDesigns: JSON.stringify(updatedSelectedDesigns) },
				})
			}
		})
	} catch (error) {
		console.log(error)
		return submissionErrorResponse(submission)
	}

	return json({ status: 'success', submission } as const)
}

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
