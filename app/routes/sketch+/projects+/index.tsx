import {
	json,
	type MetaFunction,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { requireUserId } from '#app/utils/auth.server'

export async function loader({ request }: LoaderFunctionArgs) {
	console.log('sketch+ projects index route')
	await requireUserId(request)
	return json({})
}

export default function SketchProjectsIndexRoute() {
	return (
		<div className="container">
			<h2 className="mb-2 pt-12 text-h2 lg:mb-6">Choose a project</h2>
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
