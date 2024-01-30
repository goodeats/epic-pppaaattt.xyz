import { parse } from '@conform-to/zod'
import { json } from '@remix-run/node'
import { z } from 'zod'
import {
	formatSringsToHex,
	validateStringsAreHexcodes,
} from '#app/utils/colors'
import { prisma } from '#app/utils/db.server'
import {
	capitalize,
	removeWhitespace,
	trimSpacesInBetween,
} from '#app/utils/string-formatting'
import {
	updateArtboardBackgroundColor,
	updateArtboardDimensions,
} from './mutations'

export const INTENT = {
	downloadArtboardCanvas: 'download-artboard-canvas' as const,
	updateArtboardDimensions: 'update-artboard-dimensions' as const,
	updateArtboardBackgroundColor: 'update-artboard-background-color' as const,
	updateArtboardAppearancesAdd: 'update-artboard-appearances-add' as const,
}

type EditorActionArgs = {
	request: Request
	userId: string
	formData: FormData
}

export const DownloadArtboardCanvasSchema = z.object({
	artboardId: z.string(),
})

export async function downloadArtboardCanvasAction({
	formData,
}: EditorActionArgs) {
	console.log('DOWNLOAD ACTION')
	const submission = await parse(formData, {
		schema: DownloadArtboardCanvasSchema,
	})
	if (submission.intent !== 'submit') {
		return json({ status: 'idle', submission } as const)
	}
	if (!submission.value) {
		return json({ status: 'error', submission } as const, { status: 400 })
	}

	// TODO: consider saving artboard to an image, along with json

	return json({ status: 'success', submission } as const)
}

const widthMinLength = 1
const widthMaxLength = 10000
const heightMinLength = 1
const heightMaxLength = 10000

export const ArtboardDimensionsEditorSchema = z.object({
	id: z.string().optional(),
	width: z.number().min(widthMinLength).max(widthMaxLength),
	height: z.number().min(heightMinLength).max(heightMaxLength),
})

export async function updateArtboardDimensionsAction({
	userId,
	formData,
}: EditorActionArgs) {
	console.log('UPDATE DIMENSIONS ACTION')
	const submission = await parse(formData, {
		schema: ArtboardDimensionsEditorSchema.superRefine(async (data, ctx) => {
			if (!data.id) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `Artboard not provided`,
				})
			}

			const artboard = await prisma.artboard.findUnique({
				select: { id: true },
				where: { id: data.id, ownerId: userId },
			})
			if (!artboard) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `Artboard not found`,
				})
			}
		}),
		async: true,
	})
	if (submission.intent !== 'submit') {
		return json({ status: 'idle', submission } as const)
	}
	if (!submission.value) {
		return json({ status: 'error', submission } as const, { status: 400 })
	}

	const { id: artboardId, width, height } = submission.value

	await updateArtboardDimensions(userId, artboardId, width, height)

	return json({ status: 'success', submission } as const)
}

export const ArtboardBackgroundColorEditorSchema = z.object({
	id: z.string().optional(),
	// backgroundColor: z.string(),
	// HexcodeStringSchema,
	backgroundColor: z
		.string()
		.transform(val => removeWhitespace(val))
		.transform(val => capitalize(val))
		.transform(val => trimSpacesInBetween(val))
		.transform(val => formatSringsToHex(val.split(',')))
		.refine(validateStringsAreHexcodes, {
			message: 'Values must be valid hexcodes',
		}),
})

export async function updateArtboardBackgroundColorAction({
	userId,
	formData,
}: EditorActionArgs) {
	console.log('UPDATE BACKGROUND COLOR ACTION')
	const submission = await parse(formData, {
		schema: ArtboardBackgroundColorEditorSchema.superRefine(
			async (data, ctx) => {
				if (!data.id) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `Artboard not provided`,
					})
				}

				const artboard = await prisma.artboard.findUnique({
					select: { id: true },
					where: { id: data.id, ownerId: userId },
				})
				if (!artboard) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `Artboard not found`,
					})
				}
			},
		),
		async: true,
	})
	if (submission.intent !== 'submit') {
		return json({ status: 'idle', submission } as const)
	}
	if (!submission.value) {
		return json({ status: 'error', submission } as const, { status: 400 })
	}

	const { id: artboardId, backgroundColor } = submission.value

	await updateArtboardBackgroundColor(userId, artboardId, backgroundColor[0])

	return json({ status: 'success', submission } as const)
}

export const ArtboardAppearancesAddEditorSchema = z.object({
	artboardId: z.string(),
	appearanceIds: z.string().array(),
})
