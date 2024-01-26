import { invariantResponse } from '@epic-web/invariant'
import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { requireUserId } from '#app/utils/auth.server.ts'
import { type BreadcrumbHandle } from '#app/utils/breadcrumbs'
import { prisma } from '#app/utils/db.server.ts'

export const handle: BreadcrumbHandle = {
	breadcrumb: () => 'Appearances',
}

export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const layer = await prisma.layer.findFirst({
		where: { slug: params.layerId, ownerId: userId },
		select: { id: true, slug: true, owner: { select: { username: true } } },
	})

	invariantResponse(layer, 'Not found', { status: 404 })
	return json({ layer })
}
