import { parse } from '@conform-to/zod'
import { json, redirect, type ActionFunctionArgs } from '@remix-run/node'
import { z } from 'zod'
import { createDefaultArtworkBranchWithVersion } from '#app/models/artwork-branch/artwork-branch.create.server'
import { requireUserId } from '#app/utils/auth.server.ts'
import { validateCSRF } from '#app/utils/csrf.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { stringToSlug } from '#app/utils/misc.tsx'
import { ArtworkEditorSchema } from './new-artwork-form'

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)

	const formData = await request.formData()
	await validateCSRF(formData, request.headers)

	const submission = await parse(formData, {
		schema: ArtworkEditorSchema.superRefine(async (data, ctx) => {
			const project = await prisma.project.findUnique({
				select: { id: true },
				where: { id: data.projectId, ownerId: userId },
			})
			if (!project) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Project not found',
				})
			}

			const slug = stringToSlug(data.name)
			const artworkWithSlug = await prisma.artwork.findFirst({
				select: { id: true },
				where: { slug, ownerId: userId },
			})
			if (artworkWithSlug) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Artwork with that name already exists',
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

	const { projectId, name, description } = submission.value
	const slug = stringToSlug(name)

	const createdArtwork = await prisma.artwork.create({
		select: {
			id: true,
			ownerId: true,
			slug: true,
			owner: { select: { username: true } },
			project: { select: { slug: true } },
		},
		data: {
			ownerId: userId,
			projectId,
			name,
			description,
			slug,
		},
	})

	await createDefaultArtworkBranchWithVersion({
		artwork: createdArtwork,
	})

	const { owner } = createdArtwork
	return redirect(`/users/${owner.username}/artworks/${createdArtwork.slug}`)
}
