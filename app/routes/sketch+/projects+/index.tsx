import {
	json,
	type MetaFunction,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { requireUserId } from '#app/utils/auth.server'

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
	await requireUserId(request)
	console.log('sketch+ projects index route')
	return json({})
}

export default function SketchProjectsIndexRoute() {
	return (
		<div className="container">
			<h2 className="mb-2 pt-12 text-h2 lg:mb-6">Choose a project</h2>
		</div>
	)
}
