import { json } from '@remix-run/node'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import {
	DeleteArtboardLayerSchema,
	EditArtboardLayerDescriptionSchema,
	EditArtboardLayerNameSchema,
	NewArtboardLayerSchema,
	ReorderArtboardLayerSchema,
	ToggleVisibilityArtboardLayerSchema,
} from '#app/schema/layer'
import {
	notSubmissionResponse,
	submissionErrorResponse,
} from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import { findFirstLayerInstance } from '#app/utils/prisma-extensions-layer'
import { artboardLayerCreateService } from '../services/artboard/layer/create.service'
import { artboardLayerDeleteService } from '../services/artboard/layer/delete.service'
import {
	parseArtboardLayerSubmission,
	parseArtboardLayerUpdateSubmission,
} from './utils'

async function validateSubmission({
	userId,
	formData,
	schema,
}: {
	userId: string
	formData: FormData
	schema:
		| typeof NewArtboardLayerSchema
		| typeof EditArtboardLayerNameSchema
		| typeof EditArtboardLayerDescriptionSchema
		| typeof ReorderArtboardLayerSchema
		| typeof ToggleVisibilityArtboardLayerSchema
		| typeof DeleteArtboardLayerSchema
}) {
	const newDesign = schema === NewArtboardLayerSchema
	const submission = newDesign
		? await parseArtboardLayerSubmission({ userId, formData, schema })
		: await parseArtboardLayerUpdateSubmission({ userId, formData, schema })

	if (submission.intent !== 'submit') {
		return { response: notSubmissionResponse(submission), isValid: false }
	}
	if (!submission.value) {
		return { response: submissionErrorResponse(submission), isValid: false }
	}

	return { submission, isValid: true }
}

export async function artboardLayerNewAction({
	userId,
	formData,
}: IntentActionArgs) {
	const { submission, isValid, response } = await validateSubmission({
		userId,
		formData,
		schema: NewArtboardLayerSchema,
	})
	if (!isValid || !submission) return response

	const { artboardId } = submission.value
	const { success, error } = await artboardLayerCreateService({
		userId,
		artboardId,
	})

	if (error) return submissionErrorResponse(submission)

	return json({ status: 'success', submission, success } as const)
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

export async function artboardLayerReorderAction({
	userId,
	formData,
}: IntentActionArgs) {
	// validation
	const submission = await parseArtboardLayerUpdateSubmission({
		userId,
		formData,
		schema: ReorderArtboardLayerSchema,
	})
	if (submission.intent !== 'submit') {
		return notSubmissionResponse(submission)
	}
	if (!submission.value) {
		return submissionErrorResponse(submission)
	}

	// changes
	const { id, direction } = submission.value
	try {
		await prisma.$transaction(async prisma => {
			// get layer first and its next and prev ids
			const layer = await prisma.layer.findFirst({
				where: { id, ownerId: userId },
			})
			if (!layer) return submissionErrorResponse(submission)
			const { nextId, prevId } = layer

			// remove unique constraints on current layer
			const currentLayerRemoveNodes = prisma.layer.update({
				where: { id },
				data: { prevId: null, nextId: null },
			})

			if (direction === 'up') {
				// if layer is head, do nothing
				if (!prevId) return submissionErrorResponse(submission)

				// CURRENT LAYER PREV LAYER (required unless was head)
				const prev = await prisma.layer.findFirst({
					where: { id: prevId },
				})
				if (!prev) return submissionErrorResponse(submission)

				// this and current layer are swapping places
				const prevLayerRemoveNodes = prisma.layer.update({
					where: { id: prevId },
					data: { prevId: null, nextId: null },
				})

				const prevLayerUpdateNodes = prisma.layer.update({
					where: { id: prevId },
					data: { nextId, prevId: id },
				})

				// CURRENT LAYER PREV PREV LAYER (required unless prev was head)
				// check if prev layer had its own prev layer
				// and set nextId of prev prev layer to current id of layer
				let prevPrevLayerUpdateNext
				if (prev.prevId) {
					const prevPrevLayer = await prisma.layer.findFirst({
						where: { id: prev.prevId },
					})
					if (prevPrevLayer) {
						prevPrevLayerUpdateNext = prisma.layer.update({
							where: { id: prev.prevId },
							data: { nextId: id },
						})
					}
				}

				// CURRENT LAYER NEXT LAYER (optional if was tail)
				let nextLayerRemovePrev, nextLayerUpdatePrev
				if (nextId) {
					const next = await prisma.layer.findFirst({
						where: { id: nextId },
					})
					if (next) {
						nextLayerRemovePrev = prisma.layer.update({
							where: { id: nextId },
							data: { prevId: null },
						})

						nextLayerUpdatePrev = prisma.layer.update({
							where: { id: nextId },
							data: { prevId },
						})
					}
				}

				// update prevId of current layer to prevId of prev layer
				// and nextId of current layer to id of prev layer
				const currentLayerUpdateNodes = prisma.layer.update({
					where: { id },
					data: { prevId: prev.prevId, nextId: prevId },
				})

				// order of promises is important
				// since unique constraints will fail the transaction
				const promises = []
				promises.push(currentLayerRemoveNodes)
				promises.push(prevLayerRemoveNodes)
				if (nextLayerRemovePrev) promises.push(nextLayerRemovePrev)
				if (nextLayerUpdatePrev) promises.push(nextLayerUpdatePrev)
				promises.push(prevPrevLayerUpdateNext)
				promises.push(prevLayerUpdateNodes)
				promises.push(currentLayerUpdateNodes)
				await Promise.all(promises)
			} else if (direction === 'down') {
				console.log('down')
				// if layer is tail, do nothing
				if (!nextId) return submissionErrorResponse(submission)

				// CURRENT LAYER NEXT LAYER (required unless was tail)
				const next = await prisma.layer.findFirst({
					where: { id: nextId },
				})
				if (!next) return submissionErrorResponse(submission)

				// this and current layer are swapping places
				const nextLayerRemoveNodes = prisma.layer.update({
					where: { id: nextId },
					data: { prevId: null, nextId: null },
				})

				const nextLayerUpdateNodes = prisma.layer.update({
					where: { id: nextId },
					data: { nextId: id, prevId },
				})

				// CURRENT LAYER NEXT NEXT LAYER (required unless next was tail)
				// check if next layer had its own next layer
				// and set nextId of next next layer to current id of layer
				let nextNextLayerUpdatePrev
				if (next.nextId) {
					const nextNextLayer = await prisma.layer.findFirst({
						where: { id: next.nextId },
					})
					if (nextNextLayer) {
						nextNextLayerUpdatePrev = prisma.layer.update({
							where: { id: next.nextId },
							data: { prevId: id },
						})
					}
				}

				// CURRENT LAYER PREV LAYER (optional if was head)
				let prevLayerRemoveNext, prevLayerUpdateNext
				if (prevId) {
					const prev = await prisma.layer.findFirst({
						where: { id: prevId },
					})
					if (prev) {
						prevLayerRemoveNext = prisma.layer.update({
							where: { id: prevId },
							data: { nextId: null },
						})

						prevLayerUpdateNext = prisma.layer.update({
							where: { id: prevId },
							data: { nextId },
						})
					}
				}

				// update nextId of current layer to nextId of prev layer
				// and nextId of current layer to id of prev layer
				const currentLayerUpdateNodes = prisma.layer.update({
					where: { id },
					data: { nextId: next.nextId, prevId: nextId },
				})

				// order of promises is important
				// since unique constraints will fail the transaction
				const promises = []
				promises.push(currentLayerRemoveNodes)
				promises.push(nextLayerRemoveNodes)
				if (prevLayerRemoveNext) promises.push(prevLayerRemoveNext)
				if (prevLayerUpdateNext) promises.push(prevLayerUpdateNext)
				promises.push(nextNextLayerUpdatePrev)
				promises.push(nextLayerUpdateNodes)
				promises.push(currentLayerUpdateNodes)
				await Promise.all(promises)
			}
		})
	} catch (error) {
		console.log(error)
		return submissionErrorResponse(submission)
	}

	return json({ status: 'success', submission } as const)
}

export async function artboardLayerToggleVisibilityAction({
	userId,
	formData,
}: IntentActionArgs) {
	// validation
	const submission = await parseArtboardLayerUpdateSubmission({
		userId,
		formData,
		schema: ToggleVisibilityArtboardLayerSchema,
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
			const layer = await prisma.layer.findFirst({
				where: { id, ownerId: userId },
			})
			if (!layer) return submissionErrorResponse(submission)

			await prisma.layer.update({
				where: { id },
				data: { visible: !layer.visible },
			})
		})
	} catch (error) {
		console.log(error)
		return submissionErrorResponse(submission)
	}

	return json({ status: 'success', submission } as const)
}

export async function artboardLayerDeleteAction({
	userId,
	formData,
}: IntentActionArgs) {
	const { submission, isValid, response } = await validateSubmission({
		userId,
		formData,
		schema: DeleteArtboardLayerSchema,
	})
	if (!isValid || !submission) return response

	const { id, artboardId } = submission.value
	const { success, error } = await artboardLayerDeleteService({
		userId,
		id,
		artboardId,
	})

	if (error) return submissionErrorResponse(submission)

	return json({ status: 'success', submission, success } as const)
}
