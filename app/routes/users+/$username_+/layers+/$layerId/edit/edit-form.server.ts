import { parse } from '@conform-to/zod'
import { json, redirect, type ActionFunctionArgs } from '@remix-run/node'
import { z } from 'zod'
import { requireUserId } from '#app/utils/auth.server.ts'
import { validateCSRF } from '#app/utils/csrf.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { stringToSlug } from '#app/utils/misc.tsx'
import { LayerEditorSchema } from './edit-form'

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)

	const formData = await request.formData()
	await validateCSRF(formData, request.headers)

	const submission = await parse(formData, {
		schema: LayerEditorSchema.superRefine(async (data, ctx) => {
			if (!data.id) return

			const layer = await prisma.layer.findUnique({
				select: { id: true },
				where: { id: data.id, ownerId: userId },
			})
			if (!layer) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `Layer not found`,
				})
			}

			const slug = stringToSlug(data.name)
			const entityWithSlug = await prisma.layer.findFirst({
				select: { id: true },
				where: { slug, ownerId: userId },
			})
			if (entityWithSlug && entityWithSlug.id !== data.id) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `Layer with that name already exists`,
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

	const { id: layerId, name, description } = submission.value
	const slug = stringToSlug(name)

	const updatedEntity = await prisma.layer.update({
		select: { slug: true, owner: { select: { username: true } } },
		where: { id: layerId },
		data: {
			name,
			description,
			slug,
		},
	})

	return redirect(
		`/users/${updatedEntity.owner.username}/layers/${updatedEntity.slug}`,
	)
}
