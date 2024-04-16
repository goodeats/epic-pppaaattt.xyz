import {
	json,
	type MetaFunction,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { DashboardContentHeading1 } from '#app/components/layout'
import { requireUserId } from '#app/utils/auth.server'

export async function loader({ request }: LoaderFunctionArgs) {
	console.log('sketch+ projects index route')
	await requireUserId(request)
	return json({})
}

export default function SketchProjectsIndexRoute() {
	return (
		<div className="container">
			<DashboardContentHeading1>Choose a project</DashboardContentHeading1>
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
