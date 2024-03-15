import { json } from '@remix-run/node'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import {
	ArtboardSelectedDesignsSchema,
	type ArtboardSelectedDesignsType,
} from '#app/schema/artboard'
import { NewArtboardDesignSchema, designSchema } from '#app/schema/design'
import {
	EditArtboardRotateBasisSchema,
	EditArtboardRotateSchema,
} from '#app/schema/rotate'
import {
	notSubmissionResponse,
	submissionErrorResponse,
} from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import { findFirstRotateInstance } from '#app/utils/prisma-extensions-rotate'
import { parseArtboardDesignSubmission } from './utils'

export async function artboardDesignNewRotateAction({
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

	// start transaction so we can create design and rotate together
	// rotate is 1:1 with design which belongs to an artboard
	try {
		await prisma.$transaction(async prisma => {
			// new designs are appended to the end of the list
			// find the last design in the list by type
			// we know the artboard already exists for the user by this point
			const lastArtboardDesignRotate = await prisma.design.findFirst({
				where: { type: 'rotate', artboardId, nextId: null },
			})

			// create design before rotate
			const designData = designSchema.parse({
				type: 'rotate',
				ownerId: userId,
				artboardId,
			})
			const design = await prisma.design.create({
				data: designData,
			})

			// then create rotate after design
			await prisma.rotate.create({
				data: {
					designId: design.id,
				},
			})

			// if the artboard already has a rotate
			// link the new rotate to the last one
			// and the last one to the new one
			if (lastArtboardDesignRotate) {
				await prisma.design.update({
					where: { id: design.id },
					data: { prevId: lastArtboardDesignRotate.id },
				})

				await prisma.design.update({
					where: { id: lastArtboardDesignRotate.id },
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
					rotateId: design.id,
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
	const { id, rotation } = submission.value
	const rotate = await findFirstRotateInstance({
		where: { id },
	})
	if (!rotate) return submissionErrorResponse(submission)

	rotate.rotation = rotation
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
