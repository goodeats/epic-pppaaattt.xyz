import { parse } from '@conform-to/zod'
import { json, type ActionFunctionArgs, redirect } from '@remix-run/node'
import { z } from 'zod'
import { requireUserId } from '#app/utils/auth.server'
import { validateCSRF } from '#app/utils/csrf.server'
import { prisma } from '#app/utils/db.server'
import { stringToSlug } from '#app/utils/misc'
import { LayerEditorSchema } from './new-form'

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)

	const formData = await request.formData()
	await validateCSRF(formData, request.headers)

	const submission = await parse(formData, {
		schema: LayerEditorSchema.superRefine(async (data, ctx) => {
			const slug = stringToSlug(data.name)
			const entityWithSlug = await prisma.layer.findFirst({
				select: { id: true },
				where: { slug, ownerId: userId },
			})
			if (entityWithSlug) {
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

	const { name, description } = submission.value
	const slug = stringToSlug(name)

	const createdLayer = await prisma.layer.create({
		select: { slug: true, owner: { select: { username: true } } },
		data: {
			ownerId: userId,
			name,
			description,
			slug,
		},
	})

	return redirect(
		`/users/${createdLayer.owner.username}/layers/${createdLayer.slug}`,
	)
}
