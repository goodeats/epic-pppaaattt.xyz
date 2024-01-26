import { invariantResponse } from '@epic-web/invariant'
import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { requireUserId } from '#app/utils/auth.server.ts'
import { type BreadcrumbHandle } from '#app/utils/breadcrumbs'
import { prisma } from '#app/utils/db.server.ts'

export const handle: BreadcrumbHandle = {
	breadcrumb: () => 'Layers',
}

export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const artboard = await prisma.artboard.findFirst({
		where: { slug: params.artboardId, ownerId: userId },
		select: { id: true, slug: true, owner: { select: { username: true } } },
	})

	invariantResponse(artboard, 'Not found', { status: 404 })
	return json({ artboard })
}
