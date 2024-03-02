import { parse } from '@conform-to/zod'
import { type z } from 'zod'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { findArtboardByIdAndOwner } from '#app/models/artboard.server'
import { addNotFoundIssue } from '#app/utils/conform-utils'

export const parseArtboardSubmission = async ({
	userId,
	formData,
	schema,
}: IntentActionArgs & { schema: z.ZodSchema<any> }) => {
	return await parse(formData, {
		schema: schema.superRefine(async (data, ctx) => {
			const { id } = data
			const artboard = await findArtboardByIdAndOwner({ id, ownerId: userId })
			if (!artboard) ctx.addIssue(addNotFoundIssue('Artboard'))
		}),
		async: true,
	})
}

export const parseArtboardDesignSubmission = async ({
	userId,
	formData,
	schema,
}: IntentActionArgs & { schema: z.ZodSchema<any> }) => {
	return await parse(formData, {
		schema: schema.superRefine(async (data, ctx) => {
			const { artboardId } = data
			const artboard = await findArtboardByIdAndOwner({
				id: artboardId,
				ownerId: userId,
			})
			if (!artboard) ctx.addIssue(addNotFoundIssue('Artboard'))
		}),
		async: true,
	})
}
