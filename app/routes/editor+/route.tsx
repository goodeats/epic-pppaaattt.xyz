import {
	json,
	type MetaFunction,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import { FlexColumn, FlexRow } from '#app/components/layout'
import { type NavItem } from '#app/definitions/nav-item'
import { getProjectsWithArtworks } from '#app/models/project/project.get.server'
import { requireUserId } from '#app/utils/auth.server'
import { ProjectsSidebar } from './projects+/__components/projects-sidebar'

export const editorLoaderRoute = 'routes/editor+/route'
export async function loader({ request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)

	const projects = await getProjectsWithArtworks({
		where: { ownerId: userId },
	})

	// prepare the projects and artworks for the sidebar
	// nested entity nav sidebar expects an array of items
	// each item should have an id, name, path
	// and optionally an icon and children
	const navItems: NavItem[] = projects.map(project => ({
		id: project.id,
		name: project.name,
		path: project.slug,
		icon: 'stack',
		children: project.artworks.map(artwork => ({
			id: artwork.id,
			name: artwork.name,
			path: `${project.slug}/artworks/${artwork.slug}`,
			icon: 'file',
		})),
	}))

	return json({ projects, navItems })
}

export default function EditorRoute() {
	const data = useLoaderData<typeof loader>()
	const { navItems } = data

	return (
		<FlexColumn className="h-full p-2">
			<FlexRow className="flex-1 gap-2">
				<ProjectsSidebar navItems={navItems} />
				<Outlet />
			</FlexRow>
		</FlexColumn>
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
