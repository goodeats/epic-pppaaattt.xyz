import { Sidebar } from '#app/components/layout'
import { type NavItem, NestedEntityNavSidebar } from '#app/components/templates'
import { type IProjectWithArtworks } from '#app/models/project/project.server'

export const ProjectsSidebar = ({
	projects,
}: {
	projects: IProjectWithArtworks[]
}) => {
	// prepare the projects and artworks for the sidebar
	// nested entity nav sidebar expects an array of items
	// each item should have an id, name, path
	// and optionally an icon and children
	const items: NavItem[] = projects.map(project => ({
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

	return (
		<Sidebar>
			<NestedEntityNavSidebar
				items={items}
				basePath="/editor/projects"
				headerTitle="Projects"
			/>
		</Sidebar>
	)
}
