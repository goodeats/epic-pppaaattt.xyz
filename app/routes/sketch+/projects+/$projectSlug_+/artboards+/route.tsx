import { invariantResponse } from '@epic-web/invariant'
import {
	json,
	type MetaFunction,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { getProjectWithArtboards } from '#app/models/project/project.get.server'
import { getUserBasic } from '#app/models/user/user.get.server'
import { requireUserId } from '#app/utils/auth.server'
import { routeLoaderMetaData } from '#app/utils/matches'

export const projectLoaderRoute =
	'routes/sketch+/projects+/$projectSlug_+/route'
export async function loader({ params, request }: LoaderFunctionArgs) {
	console.log('sketch+ projects slug artboards route')
	const userId = await requireUserId(request)
	const owner = await getUserBasic({ where: { id: userId } })
	invariantResponse(owner, 'Owner not found', { status: 404 })

	const { projectSlug } = params
	const project = await getProjectWithArtboards({
		where: { slug: projectSlug, ownerId: owner.id },
	})
	invariantResponse(project, 'Project not found', { status: 404 })

	return json({ project })
}

export default function SketchProjectArtboardsRoute() {
	return <Outlet />
}

export const meta: MetaFunction<typeof loader> = ({ params, matches }) => {
	const projectData = routeLoaderMetaData(matches, projectLoaderRoute)
	const projectName = projectData?.project.name ?? params.slug
	return [
		{ title: `Artboards | ${projectName} | Sketchy | XYZ` },
		{
			name: 'description',
			content: `Sketchy dashboard artboards for Project: ${projectName}`,
		},
	]
}
