import { invariantResponse } from '@epic-web/invariant'
import { type LoaderFunctionArgs, redirect } from '@remix-run/node'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'

export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const project = await prisma.project.findFirst({
		where: { slug: params.projectId, ownerId: userId },
		select: { slug: true, owner: { select: { username: true } } },
	})

	invariantResponse(project, 'Not found', { status: 404 })

	// just redirect to the project page
	return redirect(`/users/${project.owner.username}/projects/${project.slug}`)
}
