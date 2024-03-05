import { json } from '@remix-run/node'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import {
	EditArtboardLayerDescriptionSchema,
	EditArtboardLayerNameSchema,
	NewArtboardLayerSchema,
} from '#app/schema/layer'
import {
	notSubmissionResponse,
	submissionErrorResponse,
} from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import { findFirstLayerInstance } from '#app/utils/prisma-extensions-layer'
import {
	parseArtboardDesignSubmission,
	parseArtboardLayerUpdateSubmission,
} from './utils'

export async function artboardLayerNewAction({
	userId,
	formData,
}: IntentActionArgs) {
	// validation
	const submission = await parseArtboardDesignSubmission({
		userId,
		formData,
		schema: NewArtboardLayerSchema,
	})
	if (submission.intent !== 'submit') {
		return notSubmissionResponse(submission)
	}
	if (!submission.value) {
		return submissionErrorResponse(submission)
	}

	// changes
	const { artboardId } = submission.value
	// start transaction so we can create layer at the end of the list
	try {
		await prisma.$transaction(async prisma => {
			// new layers are appended to the end of the list
			// find the last layer in the list by type
			// we know the artboard already exists for the user by this point
			const lastArtboardLayer = await prisma.layer.findFirst({
				where: { artboardId, nextId: null },
			})

			const artboardLayerCount = await prisma.layer.count({
				where: { artboardId },
			})
			const name = `Layer ${artboardLayerCount + 1}`

			// create layer
			const layer = await prisma.layer.create({
				data: {
					name,
					ownerId: userId,
					artboardId,
				},
			})

			// if the artboard already has a layer
			// link the new layer to the last one
			// and the last one to the new one
			if (lastArtboardLayer) {
				await prisma.layer.update({
					where: { id: layer.id },
					data: { prevId: lastArtboardLayer.id },
				})

				await prisma.layer.update({
					where: { id: lastArtboardLayer.id },
					data: { nextId: layer.id },
				})
			}
		})
	} catch (error) {
		console.log(error)
		return submissionErrorResponse(submission)
	}

	return json({ status: 'success', submission } as const)
}

export async function artboardLayerUpdateNameAction({
	userId,
	formData,
}: IntentActionArgs) {
	// validation
	const submission = await parseArtboardLayerUpdateSubmission({
		userId,
		formData,
		schema: EditArtboardLayerNameSchema,
	})
	if (submission.intent !== 'submit') {
		return notSubmissionResponse(submission)
	}
	if (!submission.value) {
		return submissionErrorResponse(submission)
	}

	// changes
	const { id, name } = submission.value
	const layer = await findFirstLayerInstance({
		where: { id },
	})
	if (!layer) return submissionErrorResponse(submission)

	layer.name = name
	layer.updatedAt = new Date()
	await layer.save()

	return json({ status: 'success', submission } as const)
}

export async function artboardLayerUpdateDescriptionAction({
	userId,
	formData,
}: IntentActionArgs) {
	// validation
	const submission = await parseArtboardLayerUpdateSubmission({
		userId,
		formData,
		schema: EditArtboardLayerDescriptionSchema,
	})
	if (submission.intent !== 'submit') {
		return notSubmissionResponse(submission)
	}
	if (!submission.value) {
		return submissionErrorResponse(submission)
	}

	// changes
	const { id, description } = submission.value
	const layer = await findFirstLayerInstance({
		where: { id },
	})
	if (!layer) return submissionErrorResponse(submission)

	layer.description = description ?? ''
	layer.updatedAt = new Date()
	await layer.save()

	return json({ status: 'success', submission } as const)
}
