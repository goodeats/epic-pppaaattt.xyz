import { invariantResponse } from '@epic-web/invariant'
import {
	json,
	type MetaFunction,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getProjectWithArtboards } from '#app/models/project/project.get.server'
import { getUserBasic } from '#app/models/user/user.get.server'
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

	return (
		<div className="container">
			<h2 className="mb-2 pt-12 text-h2 lg:mb-6">{data.project.name}</h2>
		</div>
	)
}
