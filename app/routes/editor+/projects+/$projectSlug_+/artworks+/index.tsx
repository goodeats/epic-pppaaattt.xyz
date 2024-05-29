import { invariantResponse } from '@epic-web/invariant'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import {
	DashboardContentHeading1,
	DashboardContentHeading2,
} from '#app/components/layout'
import { DashboardEntityCards } from '#app/components/templates'
import { getProjectWithArtworks } from '#app/models/project/project.get.server'
import { getUserBasic } from '#app/models/user/user.get.server'
import { requireUserId } from '#app/utils/auth.server'
import { useUser } from '#app/utils/user'

export const artworkstLoaderRoute =
	'routes/editor+/projects+/$projectSlug_+/artworks+/route'
export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const owner = await getUserBasic({ where: { id: userId } })
	invariantResponse(owner, 'Owner not found', { status: 404 })

	const { projectSlug } = params
	const project = await getProjectWithArtworks({
		where: { slug: projectSlug, ownerId: owner.id },
	})
	invariantResponse(project, 'Project not found', { status: 404 })

	return json({ project })
}

export default function EditorProjectArtworksIndexRoute() {
	const data = useLoaderData<typeof loader>()
	const { project } = data
	const user = useUser()

	return (
		<div className="container">
			<DashboardContentHeading1>{project.name}</DashboardContentHeading1>
			<DashboardContentHeading2>
				<Link
					prefetch="intent"
					to={`/editor/projects/${project.slug}/artworks`}
				>
					Artworks
				</Link>
			</DashboardContentHeading2>
			<DashboardEntityCards
				entities={project.artworks}
				type="Artwork"
				parent={project.name}
				basePathNew={`/users/${user.username}/projects/${project.slug}/artworks`}
				basePathEditor={`/users/${user.username}/artworks`}
				basePathView={`/editor/projects/${project.slug}/artworks`}
			/>
		</div>
	)
}
