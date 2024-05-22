import { invariantResponse } from '@epic-web/invariant'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import {
	DashboardBody,
	DashboardContent,
	DashboardContentHeading1,
	DashboardContentHeading2,
} from '#app/components/layout'
import { DashboardEntityCards } from '#app/components/templates'
import { getProjectsWithArtworks } from '#app/models/project/project.get.server'
import { getUserBasic } from '#app/models/user/user.get.server'
import { requireUserId } from '#app/utils/auth.server'
import { useUser } from '#app/utils/user'

export async function loader({ params, request }: LoaderFunctionArgs) {
	console.log('sketch+ index route')
	const userId = await requireUserId(request)
	const owner = await getUserBasic({ where: { id: userId } })
	invariantResponse(owner, 'Owner not found', { status: 404 })

	const projects = await getProjectsWithArtworks({
		where: { ownerId: userId },
	})
	return json({ projects })
}

export default function SketchIndexRoute() {
	const data = useLoaderData<typeof loader>()
	const user = useUser()

	return (
		<DashboardBody id="sketch-dashboard-body">
			<DashboardContent id="sketch-dashboard-content">
				<div className="container">
					<DashboardContentHeading1>Sketch Dashboard</DashboardContentHeading1>
				</div>
				<div className="container">
					<DashboardContentHeading2>
						<Link prefetch="intent" to="projects">
							Projects
						</Link>
					</DashboardContentHeading2>
					<DashboardEntityCards
						entities={data.projects}
						type="Project"
						parent="portfolio"
						basePathEditor={`/users/${user.username}/projects`}
						basePathView="projects"
					/>
				</div>
			</DashboardContent>
		</DashboardBody>
	)
}
