import { invariantResponse } from '@epic-web/invariant'
import { type LoaderFunctionArgs, redirect } from '@remix-run/node'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'

export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const artboard = await prisma.artboard.findFirst({
		where: { slug: params.artboard, ownerId: userId },
		select: { slug: true, owner: { select: { username: true } } },
	})

	invariantResponse(artboard, 'Not found', { status: 404 })

	// just redirect to the artboard page
	return redirect(
		`/users/${artboard.owner.username}/artboards/${artboard.slug}`,
	)
}
