import { json } from '@remix-run/node'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { NewArtboardDesignSchema, designSchema } from '#app/schema/design'
import {
	EditArtboardLayoutColumnsSchema,
	EditArtboardLayoutCountSchema,
	EditArtboardLayoutRowsSchema,
	EditArtboardLayoutStyleSchema,
} from '#app/schema/layout'
import {
	notSubmissionResponse,
	submissionErrorResponse,
} from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import { findFirstLayoutInstance } from '#app/utils/prisma-extensions-layout'
import { parseArtboardDesignSubmission } from './utils'

export async function artboardDesignNewLayoutAction({
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

	// start transaction so we can create design and layout together
	// layout is 1:1 with design which belongs to an artboard
	try {
		await prisma.$transaction(async prisma => {
			// new designs are appended to the end of the list
			// find the last design in the list by type
			// we know the artboard already exists for the user by this point
			const lastArtboardDesignLayout = await prisma.design.findFirst({
				where: { type: 'layout', artboardId, nextId: null },
			})

			// create design before layout
			const designData = designSchema.parse({
				type: 'layout',
				ownerId: userId,
				artboardId,
			})
			const design = await prisma.design.create({
				data: designData,
			})

			// then create layout after design
			await prisma.layout.create({
				data: {
					designId: design.id,
				},
			})

			// if the artboard already has a layout
			// link the new layout to the last one
			// and the last one to the new one
			if (lastArtboardDesignLayout) {
				await prisma.design.update({
					where: { id: design.id },
					data: { prevId: lastArtboardDesignLayout.id },
				})

				await prisma.design.update({
					where: { id: lastArtboardDesignLayout.id },
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

export async function artboardDesignEditLayoutStyleAction({
	userId,
	formData,
}: IntentActionArgs) {
	// validation
	const submission = await parseArtboardDesignSubmission({
		userId,
		formData,
		schema: EditArtboardLayoutStyleSchema,
	})

	if (submission.intent !== 'submit') {
		return notSubmissionResponse(submission)
	}
	if (!submission.value) {
		return submissionErrorResponse(submission)
	}

	// changes
	const { id, style } = submission.value
	const layout = await findFirstLayoutInstance({
		where: { id },
	})
	if (!layout) return submissionErrorResponse(submission)

	layout.style = style
	layout.updatedAt = new Date()
	await layout.save()

	return json({ status: 'success', submission } as const)
}

export async function artboardDesignEditLayoutCountAction({
	userId,
	formData,
}: IntentActionArgs) {
	// validation
	const submission = await parseArtboardDesignSubmission({
		userId,
		formData,
		schema: EditArtboardLayoutCountSchema,
	})

	if (submission.intent !== 'submit') {
		return notSubmissionResponse(submission)
	}
	if (!submission.value) {
		return submissionErrorResponse(submission)
	}

	// changes
	const { id, count } = submission.value
	const layout = await findFirstLayoutInstance({
		where: { id },
	})
	if (!layout) return submissionErrorResponse(submission)

	layout.count = count
	layout.updatedAt = new Date()
	await layout.save()

	return json({ status: 'success', submission } as const)
}

export async function artboardDesignEditLayoutRowsAction({
	userId,
	formData,
}: IntentActionArgs) {
	// validation
	const submission = await parseArtboardDesignSubmission({
		userId,
		formData,
		schema: EditArtboardLayoutRowsSchema,
	})

	if (submission.intent !== 'submit') {
		return notSubmissionResponse(submission)
	}
	if (!submission.value) {
		return submissionErrorResponse(submission)
	}

	// changes
	const { id, rows } = submission.value
	const layout = await findFirstLayoutInstance({
		where: { id },
	})
	if (!layout) return submissionErrorResponse(submission)

	layout.rows = rows
	layout.updatedAt = new Date()
	await layout.save()

	return json({ status: 'success', submission } as const)
}

export async function artboardDesignEditLayoutColumnsAction({
	userId,
	formData,
}: IntentActionArgs) {
	// validation
	const submission = await parseArtboardDesignSubmission({
		userId,
		formData,
		schema: EditArtboardLayoutColumnsSchema,
	})

	if (submission.intent !== 'submit') {
		return notSubmissionResponse(submission)
	}
	if (!submission.value) {
		return submissionErrorResponse(submission)
	}

	// changes
	const { id, columns } = submission.value
	const layout = await findFirstLayoutInstance({
		where: { id },
	})
	if (!layout) return submissionErrorResponse(submission)

	layout.columns = columns
	layout.updatedAt = new Date()
	await layout.save()

	return json({ status: 'success', submission } as const)
}
