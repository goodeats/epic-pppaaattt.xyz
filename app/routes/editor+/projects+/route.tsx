import { invariantResponse } from '@epic-web/invariant'
import {
	json,
	type MetaFunction,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import {
	DashboardBody,
	DashboardContent,
	DashboardContentWrapper,
} from '#app/components/layout'
import { getProjectsWithArtworks } from '#app/models/project/project.get.server'
import { getUserBasic } from '#app/models/user/user.get.server'
import { requireUserId } from '#app/utils/auth.server'
import { ProjectsSidebar } from './components/projects-sidebar'

export const projectsLoaderRoute = 'routes/editor+/projects+/route'
export async function loader({ request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const owner = await getUserBasic({ where: { id: userId } })
	invariantResponse(owner, 'Owner not found', { status: 404 })

	const projects = await getProjectsWithArtworks({
		where: { ownerId: userId },
	})
	return json({ projects })
}

export default function EditorProjectsRoute() {
	const data = useLoaderData<typeof loader>()
	const { projects } = data

	// route files down the path will just be output
	// so that the index file will fill the content and not crash the dashboard ui
	// want to set up the projects sidebar here at this level
	return (
		<DashboardBody>
			<ProjectsSidebar projects={projects} />
			<DashboardContent>
				<DashboardContentWrapper>
					<Outlet />
				</DashboardContentWrapper>
			</DashboardContent>
		</DashboardBody>
	)
}

export const meta: MetaFunction = () => {
	return [
		{ title: 'Projects | Editor | XYZ' },
		{
			name: 'description',
			content: 'Editor dashboard for XYZ - Projects',
		},
	]
}
