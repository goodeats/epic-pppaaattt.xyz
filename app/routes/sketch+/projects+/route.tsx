import { invariantResponse } from '@epic-web/invariant'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { Link, Outlet, useLoaderData } from '@remix-run/react'
import {
	DashboardBody,
	DashboardContent,
	DashboardContentContainer,
	DashboardContentWrapper,
} from '#app/components/layout'
import { DashboardEntityCards } from '#app/components/templates'
import { getProjectsWithArtboards } from '#app/models/project/project.get.server'
import { getUserBasic } from '#app/models/user/user.get.server'
import { requireUserId } from '#app/utils/auth.server'
import { useUser } from '#app/utils/user'
import { ProjectsSidebar } from './components/projects-sidebar'

export async function loader({ request }: LoaderFunctionArgs) {
	console.log('sketch+ projects route')
	const userId = await requireUserId(request)
	const owner = await getUserBasic({ where: { id: userId } })
	invariantResponse(owner, 'Owner not found', { status: 404 })

	const projects = await getProjectsWithArtboards({
		where: { ownerId: userId },
	})
	return json({ projects })
}

export default function SketchProjectsRoute() {
	const data = useLoaderData<typeof loader>()
	const { projects } = data
	const user = useUser()

	return (
		<DashboardBody id="sketch-dashboard-body">
			<ProjectsSidebar projects={projects} />
			<DashboardContent id="sketch-dashboard-content">
				<DashboardContentWrapper>
					<DashboardContentContainer>
						<Outlet />
						<div className="container">
							<h3 className="mb-2 pt-12 text-h3 lg:mb-6">
								<Link prefetch="intent" to="/sketch/projects">
									Projects
								</Link>
							</h3>
							<DashboardEntityCards
								entities={projects}
								type="Project"
								parent="portfolio"
								basePathEditor={`/users/${user.username}/projects`}
								basePathView={'/sketch/projects'}
							/>
						</div>
					</DashboardContentContainer>
				</DashboardContentWrapper>
			</DashboardContent>
		</DashboardBody>
	)
}
