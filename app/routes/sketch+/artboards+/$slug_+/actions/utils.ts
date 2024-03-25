import { parse } from '@conform-to/zod'
import { type z } from 'zod'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { findArtboardByIdAndOwner } from '#app/models/artboard.server'
import {
	findDesignByIdAndOwner,
	findFirstDesign,
} from '#app/models/design.server'
import { findLayerByIdAndOwner } from '#app/models/layer.server'
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

export const parseArtboardDesignUpdateSubmission = async ({
	userId,
	formData,
	schema,
}: IntentActionArgs & { schema: z.ZodSchema<any> }) => {
	return await parse(formData, {
		schema: schema.superRefine(async (data, ctx) => {
			const { artboardId, id } = data

			const artboard = await findArtboardByIdAndOwner({
				id: artboardId,
				ownerId: userId,
			})
			if (!artboard) ctx.addIssue(addNotFoundIssue('Artboard'))

			const design = await findFirstDesign({
				where: {
					id,
					ownerId: userId,
					artboardId,
				},
			})
			if (!design) ctx.addIssue(addNotFoundIssue('Design'))
		}),
		async: true,
	})
}

export const parseArtboardDesignTypeSubmission = async ({
	userId,
	formData,
	schema,
}: IntentActionArgs & { schema: z.ZodSchema<any> }) => {
	return await parse(formData, {
		schema: schema.superRefine(async (data, ctx) => {
			const { artboardId, designId } = data

			const artboard = await findArtboardByIdAndOwner({
				id: artboardId,
				ownerId: userId,
			})
			if (!artboard) ctx.addIssue(addNotFoundIssue('Artboard'))

			const design = await findDesignByIdAndOwner({
				id: designId,
				ownerId: userId,
			})
			if (!design) ctx.addIssue(addNotFoundIssue('Design'))
		}),
		async: true,
	})
}

export const parseArtboardLayerSubmission = async ({
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

export const parseArtboardLayerUpdateSubmission = async ({
	userId,
	formData,
	schema,
}: IntentActionArgs & { schema: z.ZodSchema<any> }) => {
	return await parse(formData, {
		schema: schema.superRefine(async (data, ctx) => {
			const { artboardId, layerId } = data

			const artboard = await findArtboardByIdAndOwner({
				id: artboardId,
				ownerId: userId,
			})
			if (!artboard) ctx.addIssue(addNotFoundIssue('Artboard'))

			const design = await findLayerByIdAndOwner({
				id: layerId,
				ownerId: userId,
			})
			if (!design) ctx.addIssue(addNotFoundIssue('Layer'))
		}),
		async: true,
	})
}

export const parseLayerDesignSubmission = async ({
	userId,
	formData,
	schema,
}: IntentActionArgs & { schema: z.ZodSchema<any> }) => {
	return await parse(formData, {
		schema: schema.superRefine(async (data, ctx) => {
			const { layerId } = data
			const layer = await findLayerByIdAndOwner({
				id: layerId,
				ownerId: userId,
			})
			if (!layer) ctx.addIssue(addNotFoundIssue('Layer'))
		}),
		async: true,
	})
}

export const parseLayerDesignUpdateSubmission = async ({
	userId,
	formData,
	schema,
}: IntentActionArgs & { schema: z.ZodSchema<any> }) => {
	return await parse(formData, {
		schema: schema.superRefine(async (data, ctx) => {
			const { layerId, id } = data

			const layer = await findLayerByIdAndOwner({
				id: layerId,
				ownerId: userId,
			})
			if (!layer) ctx.addIssue(addNotFoundIssue('Layer'))

			const design = await findFirstDesign({
				where: {
					id,
					ownerId: userId,
					layerId,
				},
			})
			if (!design) ctx.addIssue(addNotFoundIssue('Design'))
		}),
		async: true,
	})
}

export const parseDesignSubmission = async ({
	userId,
	formData,
	schema,
}: IntentActionArgs & { schema: z.ZodSchema<any> }) => {
	return await parse(formData, {
		schema: schema.superRefine(async (data, ctx) => {
			const { designId } = data
			const design = await findDesignByIdAndOwner({
				id: designId,
				ownerId: userId,
			})
			if (!design) ctx.addIssue(addNotFoundIssue('Design'))
		}),
		async: true,
	})
}
