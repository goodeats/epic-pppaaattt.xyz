import { parse } from '@conform-to/zod'
import { type ActionFunctionArgs, json, redirect } from '@remix-run/node'
import { z } from 'zod'
import { requireUserId } from '#app/utils/auth.server'
import { validateCSRF } from '#app/utils/csrf.server'
import { prisma } from '#app/utils/db.server'
import { stringToSlug } from '#app/utils/misc'
import { ArtworkEditorSchema } from './edit-form'

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)

	const formData = await request.formData()
	await validateCSRF(formData, request.headers)

	const submission = await parse(formData, {
		schema: ArtworkEditorSchema.superRefine(async (data, ctx) => {
			if (!data.id) return

			const artwork = await prisma.artwork.findUnique({
				select: { id: true },
				where: { id: data.id, ownerId: userId },
			})
			if (!artwork) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `Artwork not found`,
				})
			}

			const slug = stringToSlug(data.name)
			const entityWithSlug = await prisma.artwork.findFirst({
				select: { id: true },
				where: { slug, ownerId: userId },
			})
			if (entityWithSlug && entityWithSlug.id !== data.id) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `Artwork with that name already exists`,
				})
			}
		}),
		async: true,
	})

	if (submission.intent !== 'submit') {
		return json({ submission } as const)
	}

	if (!submission.value) {
		return json({ submission } as const, { status: 400 })
	}

	const {
		id: artworkId,
		name,
		description,
		isVisible,
		width,
		height,
		backgroundColor,
	} = submission.value
	const slug = stringToSlug(name)

	const updatedArtwork = await prisma.artwork.update({
		select: { slug: true, owner: { select: { username: true } } },
		where: { id: artworkId },
		data: {
			name,
			description,
			isVisible: isVisible ?? false,
			slug,
			width,
			height,
			backgroundColor: backgroundColor[0],
		},
	})

	return redirect(
		`/users/${updatedArtwork.owner.username}/artworks/${updatedArtwork.slug}`,
	)
}
