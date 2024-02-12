import { parse } from '@conform-to/zod'
import { json } from '@remix-run/node'
import { z } from 'zod'
import {
	AppearanceType,
	appearanceTypeValueSchema,
} from '#app/utils/appearances'
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
	addArtboardAppearances,
	createArtboardAppearance,
	deleteArtboardAppearance,
	removeArtboardAppearance,
	toggleArtboardAppearanceVisibility,
	updateArtboardAppearanceValue,
	updateArtboardAppearancesAdd,
	updateArtboardBackgroundColor,
	updateArtboardDimensions,
} from './mutations'

export const INTENT = {
	downloadArtboardCanvas: 'download-artboard-canvas' as const,
	updateArtboardDimensions: 'update-artboard-dimensions' as const,
	updateArtboardBackgroundColor: 'update-artboard-background-color' as const,
	updateArtboardAppearancesAdd: 'update-artboard-appearances-add' as const, // deprecated
	addArtboardAppearances: 'add-artboard-appearances' as const,
	removeArtboardAppearance: 'remove-artboard-appearance' as const,
	// panel
	createArtboardAppearance: 'create-artboard-appearance' as const,
	updateArtboardAppearanceValue: 'update-artboard-appearance-value' as const,
	deleteArtboardAppearance: 'delete-artboard-appearance' as const,
	toggleArtboardAppearanceVisibility:
		'toggle-artboard-appearance-visibility' as const,
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

export async function updateArtboardAppearancesAddAction({
	userId,
	formData,
}: EditorActionArgs) {
	console.log('UPDATE APPEARANCES ADD ACTION')
	const submission = await parse(formData, {
		schema: ArtboardAppearancesAddEditorSchema.superRefine(
			async (data, ctx) => {
				const artboard = await prisma.artboard.findUnique({
					select: { id: true },
					where: { id: data.artboardId, ownerId: userId },
				})
				if (!artboard) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Artboard not found',
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

	const { artboardId, appearanceIds } = submission.value

	await updateArtboardAppearancesAdd(userId, artboardId, appearanceIds)

	return json({ status: 'success', submission } as const)
}

export const NewArtboardAppearanceSchema = z.object({
	artboardId: z.string(),
	appearanceType: z.nativeEnum(AppearanceType),
})

export async function createArtboardAppearanceAction({
	userId,
	formData,
}: EditorActionArgs) {
	console.log('CREATE ARTBOARD APPEARANCE ACTION')
	const submission = await parse(formData, {
		schema: NewArtboardAppearanceSchema.superRefine(async (data, ctx) => {
			const artboard = await prisma.artboard.findUnique({
				select: { id: true },
				where: { id: data.artboardId, ownerId: userId },
			})
			if (!artboard) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Artboard not found',
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

	const { artboardId, appearanceType } = submission.value

	await createArtboardAppearance(userId, artboardId, appearanceType)

	return json({ status: 'success', submission } as const)
}

export const DeleteArtboardAppearanceSchema = z.object({
	artboardId: z.string(),
	appearanceId: z.string(),
})

export async function deleteArtboardAppearanceAction({
	userId,
	formData,
}: EditorActionArgs) {
	console.log('DELETE ARTBOARD APPEARANCE ACTION')
	const submission = await parse(formData, {
		schema: DeleteArtboardAppearanceSchema.superRefine(async (data, ctx) => {
			const artboard = await prisma.artboard.findUnique({
				select: { id: true },
				where: { id: data.artboardId, ownerId: userId },
			})
			if (!artboard) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Artboard not found',
				})
			}

			const appearance = await prisma.appearance.findUnique({
				select: { id: true },
				where: { id: data.appearanceId, ownerId: userId },
			})
			if (!appearance) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Appearance not found',
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

	const { artboardId, appearanceId } = submission.value

	await deleteArtboardAppearance(userId, artboardId, appearanceId)

	return json({ status: 'success', submission } as const)
}

export const AddArtboardAppearancesEditorSchema = z.object({
	artboardId: z.string(),
	appearanceIds: z.string().array(),
})

export async function addArtboardAppearancesAction({
	userId,
	formData,
}: EditorActionArgs) {
	console.log('ADD ARTBOARD APPEARANCES ACTION')
	const submission = await parse(formData, {
		schema: AddArtboardAppearancesEditorSchema.superRefine(
			async (data, ctx) => {
				const artboard = await prisma.artboard.findUnique({
					select: { id: true },
					where: { id: data.artboardId, ownerId: userId },
				})
				if (!artboard) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Artboard not found',
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

	const { artboardId, appearanceIds } = submission.value

	await addArtboardAppearances(userId, artboardId, appearanceIds)

	return json({ status: 'success', submission } as const)
}

export const RemoveArtboardAppearanceEditorSchema = z.object({
	artboardId: z.string(),
	appearanceId: z.string(),
})

export async function removeArtboardAppearanceAction({
	userId,
	formData,
}: EditorActionArgs) {
	console.log('REMOVE ARTBOARD APPEARANCES ACTION')
	const submission = await parse(formData, {
		schema: RemoveArtboardAppearanceEditorSchema.superRefine(
			async (data, ctx) => {
				const artboard = await prisma.artboard.findUnique({
					select: { id: true },
					where: { id: data.artboardId, ownerId: userId },
				})
				if (!artboard) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Artboard not found',
					})
				}

				const appearance = await prisma.appearance.findUnique({
					select: { id: true },
					where: { id: data.appearanceId, ownerId: userId },
				})
				if (!appearance) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Appearance not found',
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

	const { artboardId, appearanceId } = submission.value

	await removeArtboardAppearance(userId, artboardId, appearanceId)

	return json({ status: 'success', submission } as const)
}

export const ToggleArtboardAppearanceVisibilitySchema = z.object({
	artboardId: z.string(),
	appearanceId: z.string(),
})

export async function toggleArtboardAppearanceVisibilityAction({
	userId,
	formData,
}: EditorActionArgs) {
	console.log('TOGGLE ARTBOARD APPEARANCE VISIBILITY ACTION')
	const submission = await parse(formData, {
		schema: ToggleArtboardAppearanceVisibilitySchema.superRefine(
			async (data, ctx) => {
				const artboard = await prisma.artboard.findUnique({
					select: { id: true },
					where: { id: data.artboardId, ownerId: userId },
				})
				if (!artboard) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Artboard not found',
					})
				}

				const appearance = await prisma.appearance.findUnique({
					select: { id: true },
					where: { id: data.appearanceId, ownerId: userId },
				})
				if (!appearance) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Appearance not found',
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

	const { artboardId, appearanceId } = submission.value

	await toggleArtboardAppearanceVisibility(userId, artboardId, appearanceId)

	return json({ status: 'success', submission } as const)
}

export const UpdateArtboardAppearanceValueSchema = z.object({
	appearanceId: z.string(),
	appearanceType: z.nativeEnum(AppearanceType),
	value: z.string(),
})

export async function updateArtboardAppearanceValueAction({
	userId,
	formData,
}: EditorActionArgs) {
	console.log('UPDATE ARTBOARD APPEARANCE VALUE ACTION')
	const appearanceType = formData.get('appearanceType')
	const AppearanceTypeValueSchema = appearanceTypeValueSchema(
		appearanceType as AppearanceType,
	)
	const Schema =
		AppearanceTypeValueSchema || UpdateArtboardAppearanceValueSchema

	const submission = await parse(formData, {
		schema: Schema.superRefine(async (data, ctx) => {
			const appearance = await prisma.appearance.findUnique({
				select: { id: true },
				where: { id: data.appearanceId, ownerId: userId },
			})
			if (!appearance) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Appearance not found',
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

	const { appearanceId, value } = submission.value

	await updateArtboardAppearanceValue(userId, appearanceId, value)

	return json({ status: 'success', submission } as const)
}
