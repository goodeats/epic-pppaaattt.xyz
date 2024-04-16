import { invariantResponse } from '@epic-web/invariant'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import {
	DashboardBody,
	DashboardContent,
	DashboardContentContainer,
	DashboardContentWrapper,
} from '#app/components/layout'
import { getProjectsWithArtboards } from '#app/models/project/project.get.server'
import { getUserBasic } from '#app/models/user/user.get.server'
import { requireUserId } from '#app/utils/auth.server'
import { ProjectsSidebar } from './components/projects-sidebar'

export const projectsLoaderRoute = 'routes/sketch+/projects+/route'
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

	// route files down the path will just be output
	// so that the index file will fill the content and not crash the dashboard ui
	// want to set up the projects sidebar here at this level
	return (
		<DashboardBody id="sketch-dashboard-body">
			<ProjectsSidebar projects={projects} />
			<DashboardContent id="sketch-dashboard-content">
				<DashboardContentWrapper>
					<DashboardContentContainer>
						<Outlet />
					</DashboardContentContainer>
				</DashboardContentWrapper>
			</DashboardContent>
		</DashboardBody>
	)
}
