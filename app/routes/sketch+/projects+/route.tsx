import { invariantResponse } from '@epic-web/invariant'
import {
	json,
	type MetaFunction,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { Link, Outlet, useLoaderData } from '@remix-run/react'
import { DashboardBody, DashboardContent } from '#app/components/layout'
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

	return (
		<DashboardBody id="sketch-dashboard-body">
			<DashboardContent id="sketch-dashboard-content">
				<Outlet />
				{/* make this a sidebar? */}
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
			</DashboardContent>
		</DashboardBody>
	)
}
