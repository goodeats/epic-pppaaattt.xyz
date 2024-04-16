import {
	json,
	type MetaFunction,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { DashboardBody, DashboardContent } from '#app/components/layout'
import { getProjectsWithArtboards } from '#app/models/project/project.get.server'
import { requireUserId } from '#app/utils/auth.server'
import { Projects } from './components/projects'

export const meta: MetaFunction = () => {
	return [
		{ title: 'Sketchy | XYZ' },
		{
			name: 'description',
			content: 'Sketchy dashboard for XYZ',
		},
	]
}

export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const projects = await getProjectsWithArtboards({
		where: { ownerId: userId },
	})
	return json({ projects })
}

export default function SketchIndexRoute() {
	const data = useLoaderData<typeof loader>()

	return (
		<DashboardBody id="sketch-dashboard-body">
			<DashboardContent id="sketch-dashboard-content">
				<Projects projects={data.projects} />
			</DashboardContent>
		</DashboardBody>
	)
}
