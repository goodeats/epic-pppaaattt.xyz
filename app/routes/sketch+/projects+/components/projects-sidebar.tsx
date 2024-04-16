import { Sidebar } from '#app/components/layout'
import { type NavItem, NestedEntityNavSidebar } from '#app/components/templates'
import { type IProjectWithArtboards } from '#app/models/project/project.server'

export const ProjectsSidebar = ({
	projects,
}: {
	projects: IProjectWithArtboards[]
}) => {
	// prepare the projects and artboards for the sidebar
	// nested entity nav sidebar expects an array of items
	// each item should have an id, name, path
	// and optionally an icon and children
	const items: NavItem[] = projects.map(project => ({
		id: project.id,
		name: project.name,
		path: project.slug,
		icon: 'stack',
		children: project.artboards.map(artboard => ({
			id: artboard.id,
			name: artboard.name,
			path: `${project.slug}/artboards/${artboard.slug}`,
			icon: 'file',
		})),
	}))

	return (
		<Sidebar id="sketch-sidebar-left">
			<NestedEntityNavSidebar
				items={items}
				basePath="/sketch/projects"
				headerTitle="Projects"
			/>
		</Sidebar>
	)
}
