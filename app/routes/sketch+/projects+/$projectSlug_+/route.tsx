import { invariantResponse } from '@epic-web/invariant'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { getProjectWithArtboards } from '#app/models/project/project.get.server'
import { getUserBasic } from '#app/models/user/user.get.server'
import { requireUserId } from '#app/utils/auth.server'

export async function loader({ params, request }: LoaderFunctionArgs) {
	console.log('sketch+ projects $slug route')
	const userId = await requireUserId(request)
	const owner = await getUserBasic({ where: { id: userId } })
	invariantResponse(owner, 'Owner not found', { status: 404 })

	const { projectSlug } = params
	console.log('params r', params)
	// console.log('slug r', slug)
	const project = await getProjectWithArtboards({
		where: { slug: projectSlug, ownerId: owner.id },
	})

	console.log('project r', project?.name)
	invariantResponse(project, 'Project not found', { status: 404 })

	return json({ project })
}

export default function SketchProjectRoute() {
	return <Outlet />
}
