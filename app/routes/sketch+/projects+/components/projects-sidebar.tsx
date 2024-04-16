import { NavSidebar, NavSidebarContent, Sidebar } from '#app/components/layout'
import { type IProjectWithArtboards } from '#app/models/project/project.server'

export const ProjectsSidebar = ({
	projects,
}: {
	projects: IProjectWithArtboards[]
}) => {
	return (
		<Sidebar id="sketch-sidebar-left">
			<NavSidebar>
				<NavSidebarContent>
					{projects.map(project => (
						<div key={project.id}>
							<h3>{project.name}</h3>
							<ul>
								{project.artboards.map(artboard => (
									<li key={artboard.id}>{artboard.name}</li>
								))}
							</ul>
						</div>
					))}
				</NavSidebarContent>
			</NavSidebar>
		</Sidebar>
	)
}
