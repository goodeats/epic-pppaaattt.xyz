import { json } from '@remix-run/node'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import {
	ArtboardSelectedDesignsSchema,
	type ArtboardSelectedDesignsType,
} from '#app/schema/artboard'
import { NewArtboardDesignSchema, designSchema } from '#app/schema/design'
import { EditArtboardSizeSchema } from '#app/schema/size'
import {
	notSubmissionResponse,
	submissionErrorResponse,
} from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import { findFirstSizeInstance } from '#app/utils/prisma-extensions-size'
import { parseArtboardDesignSubmission } from './utils'

export async function artboardDesignNewSizeAction({
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

	// start transaction so we can create design and size together
	// size is 1:1 with design which belongs to an artboard
	try {
		await prisma.$transaction(async prisma => {
			// new designs are appended to the end of the list
			// find the last design in the list by type
			// we know the artboard already exists for the user by this point
			const lastArtboardDesignSize = await prisma.design.findFirst({
				where: { type: 'size', artboardId, nextId: null },
			})

			// create design before size
			const designData = designSchema.parse({
				type: 'size',
				ownerId: userId,
				artboardId,
			})
			const design = await prisma.design.create({
				data: designData,
			})

			// then create size after design
			await prisma.size.create({
				data: {
					designId: design.id,
				},
			})

			// if the artboard already has a size
			// link the new size to the last one
			// and the last one to the new one
			if (lastArtboardDesignSize) {
				await prisma.design.update({
					where: { id: design.id },
					data: { prevId: lastArtboardDesignSize.id },
				})

				await prisma.design.update({
					where: { id: lastArtboardDesignSize.id },
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
					sizeId: design.id,
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

export async function artboardDesignEditSizeAction({
	userId,
	formData,
}: IntentActionArgs) {
	// validation
	const submission = await parseArtboardDesignSubmission({
		userId,
		formData,
		schema: EditArtboardSizeSchema,
	})

	if (submission.intent !== 'submit') {
		return notSubmissionResponse(submission)
	}
	if (!submission.value) {
		return submissionErrorResponse(submission)
	}

	// changes
	const { id, value } = submission.value
	const size = await findFirstSizeInstance({
		where: { id },
	})
	if (!size) return submissionErrorResponse(submission)

	size.value = value
	size.updatedAt = new Date()
	await size.save()

	return json({ status: 'success', submission } as const)
}
