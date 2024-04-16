import {
	DashboardCard,
	DashboardCardContent,
	DashboardCardFooter,
	DashboardCardFooterLink,
	DashboardCardWrapper,
} from '#app/components/templates'
import { CardContent } from '#app/components/ui/card'
import { type IProjectWithArtboards } from '#app/models/project/project.server'
import { useUser } from '#app/utils/user'

export const Projects = ({
	projects,
}: {
	projects: IProjectWithArtboards[]
}) => {
	return (
		<div className="container">
			<h2 className="mb-2 pt-12 text-h2 lg:mb-6">Projects</h2>
			{projects.length === 0 ? (
				<NoProjects />
			) : (
				<ProjectList projects={projects} />
			)}
		</div>
	)
}

const NoProjects = () => {
	return (
		<div>
			<NewProjectCard />
			<div className="flex h-80 items-center justify-center">
				<h4 className="text-h4">No projects found</h4>
			</div>
		</div>
	)
}

const ProjectList = ({ projects }: { projects: IProjectWithArtboards[] }) => (
	<DashboardCardWrapper>
		<NewProjectCard />
		{projects.map(project => (
			<ExistingProjectCard key={project.id} project={project} />
		))}
	</DashboardCardWrapper>
)

const NewProjectCard = () => {
	const user = useUser()
	return (
		<DashboardCard title="New Project" description="Create a new project">
			<DashboardCardContent>
				Add a new project to your portfolio.
			</DashboardCardContent>
			<DashboardCardFooter>
				<DashboardCardFooterLink
					to={`/users/${user.username}/projects/new`}
					icon="plus"
				>
					New
				</DashboardCardFooterLink>
			</DashboardCardFooter>
		</DashboardCard>
	)
}

const ExistingProjectCard = ({
	project,
}: {
	project: IProjectWithArtboards
}) => {
	const user = useUser()
	const artboardNames = project.artboards
		.map(artboard => artboard.name)
		.join(', ')

	return (
		<DashboardCard title={project.name} description={project.description || ''}>
			<CardContent>
				{artboardNames.length === 0 ? 'No artboards' : artboardNames}
			</CardContent>
			<DashboardCardFooter>
				<DashboardCardFooterLink
					to={`/users/${user.username}/projects/${project.slug}`}
					icon="pencil-1"
				>
					Edit
				</DashboardCardFooterLink>
				<DashboardCardFooterLink
					to={`projects/${project.slug}`}
					icon="arrow-right"
				>
					Go
				</DashboardCardFooterLink>
			</DashboardCardFooter>
		</DashboardCard>
	)
}
