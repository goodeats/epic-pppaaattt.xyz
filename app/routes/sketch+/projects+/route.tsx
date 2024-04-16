import { invariantResponse } from '@epic-web/invariant'
import {
	json,
	type MetaFunction,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { Link, Outlet, useLoaderData } from '@remix-run/react'
import {
	DashboardBody,
	DashboardContent,
	DashboardContentContainer,
	DashboardContentWrapper,
	Sidebar,
} from '#app/components/layout'
import { DashboardEntityCards } from '#app/components/templates'
import { getProjectsWithArtboards } from '#app/models/project/project.get.server'
import { getUserBasic } from '#app/models/user/user.get.server'
import { requireUserId } from '#app/utils/auth.server'
import { useUser } from '#app/utils/user'

export const meta: MetaFunction = () => {
	return [
		{ title: 'Sketchy Projects | XYZ' },
		{
			name: 'description',
			content: 'Sketchy dashboard for XYZ - Projects',
		},
	]
}

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
	const user = useUser()

	const SketchSidebar = () => {
		return (
			<Sidebar id="sketch-sidebar-left">
				<div className="absolute flex h-full w-full flex-col overflow-hidden bg-green-400">
					<div className="flex-1 overflow-y-scroll">
						<div className="mb-8 h-36 w-full bg-red-400">yo</div>
						<div className="mb-8 h-36 w-full bg-red-400">yo</div>
						<div className="mb-8 h-36 w-full bg-red-400">yo</div>
						<div className="mb-8 h-36 w-full bg-red-400">yo</div>
						<div className="mb-8 h-36 w-full bg-red-400">yo</div>
						<div className="mb-8 h-36 w-full bg-red-400">yo</div>
						<div className="mb-8 h-36 w-full bg-red-400">yo</div>
						<div className="mb-8 h-36 w-full bg-red-400">yo</div>
						<div className="mb-8 h-36 w-full bg-red-400">yo</div>
					</div>
				</div>
			</Sidebar>
		)
	}

	return (
		<DashboardBody id="sketch-dashboard-body">
			<SketchSidebar />
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
								entities={data.projects}
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
