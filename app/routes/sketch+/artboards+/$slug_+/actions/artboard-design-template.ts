import { json } from '@remix-run/node'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { NewArtboardDesignSchema, designSchema } from '#app/schema/design'
import { EditArtboardTemplateStyleSchema } from '#app/schema/template'
import {
	notSubmissionResponse,
	submissionErrorResponse,
} from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import { findFirstTemplateInstance } from '#app/utils/prisma-extensions-template'
import { parseArtboardDesignSubmission } from './utils'

export async function artboardDesignNewTemplateAction({
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

	// start transaction so we can create design and template together
	// template is 1:1 with design which belongs to an artboard
	try {
		await prisma.$transaction(async prisma => {
			// new designs are appended to the end of the list
			// find the last design in the list by type
			// we know the artboard already exists for the user by this point
			const lastArtboardDesignTemplate = await prisma.design.findFirst({
				where: { type: 'template', artboardId, nextId: null },
			})

			// create design before template
			const designData = designSchema.parse({
				type: 'template',
				ownerId: userId,
				artboardId,
			})
			const design = await prisma.design.create({
				data: designData,
			})

			// then create template after design
			await prisma.template.create({
				data: {
					designId: design.id,
				},
			})

			// if the artboard already has a template
			// link the new template to the last one
			// and the last one to the new one
			if (lastArtboardDesignTemplate) {
				await prisma.design.update({
					where: { id: design.id },
					data: { prevId: lastArtboardDesignTemplate.id },
				})

				await prisma.design.update({
					where: { id: lastArtboardDesignTemplate.id },
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

export async function artboardDesignEditTemplateStyleAction({
	userId,
	formData,
}: IntentActionArgs) {
	// validation
	const submission = await parseArtboardDesignSubmission({
		userId,
		formData,
		schema: EditArtboardTemplateStyleSchema,
	})

	if (submission.intent !== 'submit') {
		return notSubmissionResponse(submission)
	}
	if (!submission.value) {
		return submissionErrorResponse(submission)
	}

	// changes
	const { id, style } = submission.value
	const template = await findFirstTemplateInstance({
		where: { id },
	})
	if (!template) return submissionErrorResponse(submission)

	template.style = style
	template.updatedAt = new Date()
	await template.save()

	return json({ status: 'success', submission } as const)
}
