import { invariantResponse } from '@epic-web/invariant'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import {
	DashboardContentContainer,
	DashboardContentHeading1,
	DashboardContentHeading2,
} from '#app/components/layout'
import { DashboardEntityCards } from '#app/components/templates'
import { getProjectsWithArtworks } from '#app/models/project/project.get.server'
import { getUserBasic } from '#app/models/user/user.get.server'
import { requireUserId } from '#app/utils/auth.server'
import { useUser } from '#app/utils/user'
import { type loader as projectsLoader } from './route'

export async function loader({ request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const owner = await getUserBasic({ where: { id: userId } })
	invariantResponse(owner, 'Owner not found', { status: 404 })

	const projects = await getProjectsWithArtworks({
		where: { ownerId: userId },
	})
	return json({ projects })
}

export default function EditorProjectsIndexRoute() {
	const data = useLoaderData<typeof projectsLoader>()
	console.log('data', data)
	const { projects } = data
	const user = useUser()

	return (
		<DashboardContentContainer>
			<div className="container">
				<DashboardContentHeading1>Choose a project</DashboardContentHeading1>
				<div className="container">
					<DashboardContentHeading2>
						<Link prefetch="intent" to="/editor/projects">
							Projects
						</Link>
					</DashboardContentHeading2>
					<DashboardEntityCards
						entities={projects}
						type="Project"
						parent="portfolio"
						basePathEditor={`/users/${user.username}/projects`}
						basePathView={'/editor/projects'}
					/>
				</div>
			</div>
		</DashboardContentContainer>
	)
}
