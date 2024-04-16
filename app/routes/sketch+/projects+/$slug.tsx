import { invariantResponse } from '@epic-web/invariant'
import {
	json,
	type MetaFunction,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { GeneralErrorBoundary } from '#app/components/error-boundary'
import { DashboardEntityCards } from '#app/components/templates'
import { getProjectWithArtboards } from '#app/models/project/project.get.server'
import { getUserBasic } from '#app/models/user/user.get.server'
import { requireUserId } from '#app/utils/auth.server'
import { useUser } from '#app/utils/user'

export async function loader({ params, request }: LoaderFunctionArgs) {
	console.log('sketch+ projects $slug route')
	const userId = await requireUserId(request)
	const owner = await getUserBasic({ where: { id: userId } })
	invariantResponse(owner, 'Owner not found', { status: 404 })

	const { slug } = params
	const project = await getProjectWithArtboards({
		where: { slug, ownerId: owner.id },
	})
	invariantResponse(project, 'Project not found', { status: 404 })

	return json({ project })
}

export default function SketchIndexRoute() {
	const data = useLoaderData<typeof loader>()
	const { project } = data
	const user = useUser()

	return (
		<div className="container">
			<h2 className="mb-2 pt-12 text-h2 lg:mb-6">{data.project.name}</h2>
			<div className="container">
				<h3 className="mb-2 pt-12 text-h3 lg:mb-6">
					<Link prefetch="intent" to="artboards">
						Artboards
					</Link>
				</h3>
				<DashboardEntityCards
					entities={project.artboards}
					type="Artboard"
					parent={project.name}
					basePathNew={`/users/${user.username}/projects/${project.name}/artboards`}
					basePathEditor={`/users/${user.username}/artboards`}
					basePathView={'/artboards/'}
				/>
			</div>
		</div>
	)
}

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
	const projectName = data?.project.name ?? params.slug
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
