import { invariantResponse } from '@epic-web/invariant'
import {
	json,
	type MetaFunction,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { GeneralErrorBoundary } from '#app/components/error-boundary'
import {
	DashboardContentHeading1,
	DashboardContentHeading2,
} from '#app/components/layout'
import { DashboardEntityCards } from '#app/components/templates'
import { getProjectWithArtboards } from '#app/models/project/project.get.server'
import { getUserBasic } from '#app/models/user/user.get.server'
import { requireUserId } from '#app/utils/auth.server'
import { routeLoaderData } from '#app/utils/meta'
import { useUser } from '#app/utils/user'
import { projectLoaderRoute } from './route'

export async function loader({ params, request }: LoaderFunctionArgs) {
	console.log('sketch+ projects $slug index route')
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

export default function SketchProjectIndexRoute() {
	const data = useLoaderData<typeof loader>()
	const { project } = data
	const user = useUser()

	// I was hoping to find a solution to load the project from the ./route.tsx file
	// but it seems best for now to load twice: route.tsx and index.tsx
	// resource: https://sergiodxa.com/tutorials/access-loaders-data-in-remix

	// attempt 1: route loader data
	// problem: routeData could be null
	// questions: does it not know it's from parent?
	// const routeData = useRouteLoaderData<typeof projectLoader>(
	// 	'routes/sketch+/projects+/$projectSlug_+/route',
	// ) || { project: null }
	// console.log('routeData', routeData)

	// attempt 2: useMatches
	// problem: not typesafe, and could be null
	// const matches = useMatches()
	// const projectMatch = matches.find(
	// 	m => m.id === 'routes/sketch+/projects+/$projectSlug_+/route',
	// )
	// const project = projectMatch?.data?.project ?? { project: null }
	// if (!project) {
	// 	return <div>no project</div>
	// }

	// attempt 3: useMatches pt 2
	// very clever to use at(-2) to go up the array indexes
	// to get the project data from the parent route
	// problem: this looks hacky, and not sure how to make typesafe
	// questions: if I set as type is it still possibly null?
	// const match = matches.at(-2)
	// console.log('match', match)

	return (
		<div className="container">
			<DashboardContentHeading1>{project.name}!</DashboardContentHeading1>
			<DashboardContentHeading2>
				<Link prefetch="intent" to="artboards">
					Artboards
				</Link>
			</DashboardContentHeading2>
			<DashboardEntityCards
				entities={project.artboards}
				type="Artboard"
				parent={project.name}
				basePathNew={`/users/${user.username}/projects/${project.name}/artboards`}
				basePathEditor={`/users/${user.username}/artboards`}
				basePathView="artboards"
			/>
		</div>
	)
}

export const meta: MetaFunction<typeof loader> = ({ params, matches }) => {
	const projectData = routeLoaderData(matches, projectLoaderRoute)
	const projectName = projectData?.project.name ?? params.slug
	return [
		{ title: `${projectName} | Sketchy | XYZ` },
		{
			name: 'description',
			content: `Sketchy dashboard for Project: ${projectName}`,
		},
	]
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				404: ({ params }) => (
					<p>No project with the name "{params.slug}" exists</p>
				),
			}}
		/>
	)
}
