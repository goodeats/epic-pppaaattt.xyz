import { json } from '@remix-run/node'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import {
	DeleteArtboardDesignSchema,
	NewArtboardDesignSchema,
	ReorderArtboardDesignSchema,
	ToggleVisibilityArtboardDesignSchema,
} from '#app/schema/design'
import {
	notSubmissionResponse,
	submissionErrorResponse,
} from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import { artboardDesignCreateService } from '../services/artboard/design/create.service'
import { artboardDesignDeleteService } from '../services/artboard/design/delete.service'
import {
	parseArtboardDesignSubmission,
	parseArtboardDesignUpdateSubmission,
} from './utils'

export async function artboardDesignNewAction({
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
	const { artboardId, type, visibleDesignsCount } = submission.value
	const { success, error } = await artboardDesignCreateService({
		userId,
		artboardId,
		type,
		visibleDesignsCount,
	})

	if (error) return submissionErrorResponse(submission)

	return json({ status: 'success', submission, success } as const)
}

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
	const { id, direction } = submission.value
	try {
		await prisma.$transaction(async prisma => {
			const design = await prisma.design.findFirst({
				where: { id, ownerId: userId },
			})
			if (!design) return submissionErrorResponse(submission)
			const { nextId, prevId } = design

			// remove unique constraints on current design
			const currentDesignRemoveNodes = prisma.design.update({
				where: { id },
				data: { prevId: null, nextId: null },
			})

			if (direction === 'up') {
				// if design is head, do nothing
				if (!prevId) return submissionErrorResponse(submission)

				// CURRENT DESIGN PREV DESIGN (required unless was head)
				const prev = await prisma.design.findFirst({
					where: { id: prevId },
				})
				if (!prev) return submissionErrorResponse(submission)

				const prevDesignRemoveNodes = prisma.design.update({
					where: { id: prevId },
					data: { prevId: null, nextId: null },
				})

				const prevDesignUpdateNodes = prisma.design.update({
					where: { id: prevId },
					data: { nextId, prevId: id },
				})

				// CURRENT DESIGN PREV PREV DESIGN (required unless prev was head)
				// check if prev design had its own prev design
				// and set nextId of prev prev design to current id of design
				let prevPrevDesignUpdateNext
				if (prev.prevId) {
					const prevPrevDesign = await prisma.design.findFirst({
						where: { id: prev.prevId },
					})
					if (prevPrevDesign) {
						prevPrevDesignUpdateNext = prisma.design.update({
							where: { id: prev.prevId },
							data: { nextId: id },
						})
					}
				}

				// CURRENT DESIGN NEXT DESIGN (optional if was tail)
				let nextDesignRemovePrev, nextDesignUpdatePrev
				if (nextId) {
					const next = await prisma.design.findFirst({
						where: { id: nextId },
					})
					if (next) {
						nextDesignRemovePrev = prisma.design.update({
							where: { id: nextId },
							data: { prevId: null },
						})

						nextDesignUpdatePrev = prisma.design.update({
							where: { id: nextId },
							data: { prevId },
						})
					}
				}

				// update prevId of current design to prevId of prev design
				// and nextId of current design to id of prev design
				const currentDesignUpdateNodes = prisma.design.update({
					where: { id },
					data: { prevId: prev.prevId, nextId: prevId },
				})

				// order of promises is important
				// since unique constraints will fail the transaction
				const promises = []
				promises.push(currentDesignRemoveNodes)
				promises.push(prevDesignRemoveNodes)
				if (nextDesignRemovePrev) promises.push(nextDesignRemovePrev)
				if (nextDesignUpdatePrev) promises.push(nextDesignUpdatePrev)
				promises.push(prevPrevDesignUpdateNext)
				promises.push(prevDesignUpdateNodes)
				promises.push(currentDesignUpdateNodes)
				await Promise.all(promises)
			} else if (direction === 'down') {
				console.log('down')
				// if design is tail, do nothing
				if (!nextId) return submissionErrorResponse(submission)

				// CURRENT DESIGN NEXT DESIGN (required unless was tail)
				const next = await prisma.design.findFirst({
					where: { id: nextId },
				})
				if (!next) return submissionErrorResponse(submission)

				const nextDesignRemoveNodes = prisma.design.update({
					where: { id: nextId },
					data: { prevId: null, nextId: null },
				})

				const nextDesignUpdateNodes = prisma.design.update({
					where: { id: nextId },
					data: { nextId: id, prevId },
				})

				// CURRENT DESIGN NEXT NEXT DESIGN (required unless next was tail)
				// check if next design had its own next design
				// and set nextId of next next design to current id of design
				let nextNextDesignUpdatePrev
				if (next.nextId) {
					const nextNextDesign = await prisma.design.findFirst({
						where: { id: next.nextId },
					})
					if (nextNextDesign) {
						nextNextDesignUpdatePrev = prisma.design.update({
							where: { id: next.nextId },
							data: { prevId: id },
						})
					}
				}

				// CURRENT DESIGN PREV DESIGN (optional if was head)
				let prevDesignRemoveNext, prevDesignUpdateNext
				if (prevId) {
					const prev = await prisma.design.findFirst({
						where: { id: prevId },
					})
					if (prev) {
						prevDesignRemoveNext = prisma.design.update({
							where: { id: prevId },
							data: { nextId: null },
						})

						prevDesignUpdateNext = prisma.design.update({
							where: { id: prevId },
							data: { nextId },
						})
					}
				}

				// update nextId of current design to nextId of prev design
				// and nextId of current design to id of prev design
				const currentDesignUpdateNodes = prisma.design.update({
					where: { id },
					data: { nextId: next.nextId, prevId: nextId },
				})

				// order of promises is important
				// since unique constraints will fail the transaction
				const promises = []
				promises.push(currentDesignRemoveNodes)
				promises.push(nextDesignRemoveNodes)
				if (prevDesignRemoveNext) promises.push(prevDesignRemoveNext)
				if (prevDesignUpdateNext) promises.push(prevDesignUpdateNext)
				promises.push(nextNextDesignUpdatePrev)
				promises.push(nextDesignUpdateNodes)
				promises.push(currentDesignUpdateNodes)
				await Promise.all(promises)
			}
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
	const { id, artboardId } = submission.value
	const { success, error } = await artboardDesignDeleteService({
		id,
		artboardId,
	})

	if (error) return submissionErrorResponse(submission)

	return json({ status: 'success', submission, success } as const)
}
