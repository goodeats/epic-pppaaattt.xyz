import {
	json,
	type MetaFunction,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { Dashboard } from '#app/components/layout'
import { getProjectsWithArtworks } from '#app/models/project/project.get.server'
import { requireUserId } from '#app/utils/auth.server'

export async function loader({ request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)

	const projects = await getProjectsWithArtworks({
		where: { ownerId: userId },
	})
	return json({ projects })
}

export default function EditorRoute() {
	return (
		<Dashboard>
			<Outlet />
		</Dashboard>
	)
}

export const meta: MetaFunction = () => {
	return [
		{ title: 'Editor | XYZ' },
		{
			name: 'description',
			content: 'Editor dashboard for XYZ',
		},
	]
}
