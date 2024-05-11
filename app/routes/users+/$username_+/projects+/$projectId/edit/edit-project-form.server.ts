import { parse } from '@conform-to/zod'
import { json, redirect, type ActionFunctionArgs } from '@remix-run/node'
import { z } from 'zod'
import { requireUserId } from '#app/utils/auth.server.ts'
import { validateCSRF } from '#app/utils/csrf.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { stringToSlug } from '#app/utils/misc.tsx'
import { ProjectEditorSchema } from './edit-project-form'

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)

	const formData = await request.formData()
	await validateCSRF(formData, request.headers)

	const submission = await parse(formData, {
		schema: ProjectEditorSchema.superRefine(async (data, ctx) => {
			if (!data.id) return

			const project = await prisma.project.findUnique({
				select: { id: true },
				where: { id: data.id, ownerId: userId },
			})
			if (!project) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Project not found',
				})
			}

			const slug = stringToSlug(data.name)
			const projectWithSlug = await prisma.project.findFirst({
				select: { id: true },
				where: { slug, ownerId: userId },
			})
			if (projectWithSlug && projectWithSlug.id !== data.id) {
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

	const { id: projectId, name, description, isVisible } = submission.value
	const slug = stringToSlug(name)

	const updatedProject = await prisma.project.update({
		select: { slug: true, owner: { select: { username: true } } },
		where: { id: projectId },
		data: {
			name,
			description,
			isVisible: isVisible ?? false,
			slug,
		},
	})

	return redirect(
		`/users/${updatedProject.owner.username}/projects/${updatedProject.slug}`,
	)
}
