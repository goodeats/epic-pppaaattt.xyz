import { invariantResponse } from '@epic-web/invariant'
import {
	json,
	type MetaFunction,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import {
	DashboardContent,
	DashboardContentWrapper,
} from '#app/components/layout'
import { getUserBasic } from '#app/models/user/user.get.server'
import { requireUserId } from '#app/utils/auth.server'

export const projectsLoaderRoute = 'routes/editor+/projects+/route'
export async function loader({ request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const owner = await getUserBasic({ where: { id: userId } })
	invariantResponse(owner, 'Owner not found', { status: 404 })
	return json({})
}

export default function EditorProjectsRoute() {
	return (
		<DashboardContent>
			<DashboardContentWrapper>
				<Outlet />
			</DashboardContentWrapper>
		</DashboardContent>
	)
}

export const meta: MetaFunction = () => {
	return [
		{ title: 'Projects | Editor | XYZ' },
		{
			name: 'description',
			content: 'Editor dashboard for XYZ - Projects',
		},
	]
}
