import { json } from '@remix-run/node'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import {
	ArtboardSelectedDesignsSchema,
	type ArtboardSelectedDesignsType,
} from '#app/schema/artboard'
import { NewArtboardDesignSchema, designSchema } from '#app/schema/design'
import { EditArtboardLineWidthSchema } from '#app/schema/line'
import {
	notSubmissionResponse,
	submissionErrorResponse,
} from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import { findFirstLineInstance } from '#app/utils/prisma-extensions-line'
import { parseArtboardDesignSubmission } from './utils'

export async function artboardDesignNewLineAction({
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

	// start transaction so we can create design and line together
	// line is 1:1 with design which belongs to an artboard
	try {
		await prisma.$transaction(async prisma => {
			// new designs are appended to the end of the list
			// find the last design in the list by type
			// we know the artboard already exists for the user by this point
			const lastArtboardDesignLine = await prisma.design.findFirst({
				where: { type: 'line', artboardId, nextId: null },
			})

			// create design before line
			const designData = designSchema.parse({
				type: 'line',
				ownerId: userId,
				artboardId,
			})
			const design = await prisma.design.create({
				data: designData,
			})

			// then create line after design
			await prisma.line.create({
				data: {
					designId: design.id,
				},
			})

			// if the artboard already has a line
			// link the new line to the last one
			// and the last one to the new one
			if (lastArtboardDesignLine) {
				await prisma.design.update({
					where: { id: design.id },
					data: { prevId: lastArtboardDesignLine.id },
				})

				await prisma.design.update({
					where: { id: lastArtboardDesignLine.id },
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
					lineId: design.id,
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

export async function artboardDesignEditLineWidthAction({
	userId,
	formData,
}: IntentActionArgs) {
	// validation
	const submission = await parseArtboardDesignSubmission({
		userId,
		formData,
		schema: EditArtboardLineWidthSchema,
	})

	if (submission.intent !== 'submit') {
		return notSubmissionResponse(submission)
	}
	if (!submission.value) {
		return submissionErrorResponse(submission)
	}

	// changes
	const { id, width } = submission.value
	const line = await findFirstLineInstance({
		where: { id },
	})
	if (!line) return submissionErrorResponse(submission)

	line.width = width
	line.updatedAt = new Date()
	await line.save()

	return json({ status: 'success', submission } as const)
}
