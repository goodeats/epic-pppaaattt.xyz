import { invariantResponse } from '@epic-web/invariant'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { NewArtboardForm, action } from './new-artboard-form.tsx'

export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const project = await prisma.project.findFirst({
		where: { slug: params.projectId, ownerId: userId },
		select: { id: true, slug: true, owner: { select: { username: true } } },
	})

	invariantResponse(project, 'Not found', { status: 404 })
	return json({ project })
}

export { action }
export default NewArtboardForm
