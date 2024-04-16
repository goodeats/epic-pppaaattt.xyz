import { invariantResponse } from '@epic-web/invariant'
import {
	json,
	type MetaFunction,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import {
	DashboardContentHeading1,
	DashboardContentHeading2,
} from '#app/components/layout'
import { DashboardEntityCards } from '#app/components/templates'
import { getProjectsWithArtboards } from '#app/models/project/project.get.server'
import { getUserBasic } from '#app/models/user/user.get.server'
import { requireUserId } from '#app/utils/auth.server'
import { useUser } from '#app/utils/user'

export async function loader({ request }: LoaderFunctionArgs) {
	console.log('sketch+ projects index route')
	const userId = await requireUserId(request)
	const owner = await getUserBasic({ where: { id: userId } })
	invariantResponse(owner, 'Owner not found', { status: 404 })

	const projects = await getProjectsWithArtboards({
		where: { ownerId: userId },
	})
	return json({ projects })
}

export default function SketchProjectsIndexRoute() {
	const data = useLoaderData<typeof loader>()
	const { projects } = data
	const user = useUser()

	return (
		<div className="container">
			<DashboardContentHeading1>Choose a project</DashboardContentHeading1>
			<div className="container">
				<DashboardContentHeading2>
					<Link prefetch="intent" to="/sketch/projects">
						Projects
					</Link>
				</DashboardContentHeading2>
				<DashboardEntityCards
					entities={projects}
					type="Project"
					parent="portfolio"
					basePathEditor={`/users/${user.username}/projects`}
					basePathView={'/sketch/projects'}
				/>
			</div>
		</div>
	)
}

export const meta: MetaFunction = () => {
	return [
		{ title: 'Projects | Sketchy | XYZ' },
		{
			name: 'description',
			content: 'Sketchy dashboard for XYZ - Projects',
		},
	]
}
