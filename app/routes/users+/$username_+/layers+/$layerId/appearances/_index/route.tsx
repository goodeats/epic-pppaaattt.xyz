import { invariantResponse } from '@epic-web/invariant'
import { type LoaderFunctionArgs, redirect } from '@remix-run/node'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'

export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const layer = await prisma.layer.findFirst({
		where: { slug: params.layer, ownerId: userId },
		select: { slug: true, owner: { select: { username: true } } },
	})

	invariantResponse(layer, 'Not found', { status: 404 })

	// just redirect to the layer page
	return redirect(`/users/${layer.owner.username}/layers/${layer.slug}`)
}
