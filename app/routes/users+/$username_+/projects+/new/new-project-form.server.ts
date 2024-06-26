import { parse } from '@conform-to/zod'
import { json, redirect, type ActionFunctionArgs } from '@remix-run/node'
import { z } from 'zod'
import { requireUserId } from '#app/utils/auth.server.ts'
import { validateCSRF } from '#app/utils/csrf.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { stringToSlug } from '#app/utils/misc.tsx'
import { ProjectEditorSchema } from './new-project-form'

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)

	const formData = await request.formData()
	await validateCSRF(formData, request.headers)

	const submission = await parse(formData, {
		schema: ProjectEditorSchema.superRefine(async (data, ctx) => {
			const slug = stringToSlug(data.name)
			const projectWithSlug = await prisma.project.findFirst({
				select: { id: true },
				where: { slug, ownerId: userId },
			})
			if (projectWithSlug) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Project with that name already exists',
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

	const { name, description } = submission.value
	const slug = stringToSlug(name)

	const createdProject = await prisma.project.create({
		select: { slug: true, owner: { select: { username: true } } },
		data: {
			ownerId: userId,
			name,
			description,
			slug,
		},
	})

	return redirect(
		`/users/${createdProject.owner.username}/projects/${createdProject.slug}`,
	)
}
