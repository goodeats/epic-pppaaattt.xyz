import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card'
import { type IArtboard } from '#app/models/artboard.server'
import { type IProjectWithArtboards } from '#app/models/project/project.server'

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
	<div className="flex flex-col flex-wrap gap-2 md:flex-row">
		<NewProjectCard />
		{projects.map(project => (
			<ExistingProjectCard key={project.id} project={project} />
		))}
	</div>
)

const ProjectCard = ({
	title,
	description,
	children,
}: {
	title: string
	description: string
	children: React.ReactNode
}) => {
	return (
		<Card className="mb-2 w-80 lg:mb-6">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>{children}</CardContent>
		</Card>
	)
}

const CardContentBody = ({ children }: { children: React.ReactNode }) => {
	return <div className="space-y-4 truncate">{children}</div>
}

const NewProjectCard = () => (
	<ProjectCard title="New Project" description="Create a new project">
		<CardContentBody>Add a new project to your portfolio.</CardContentBody>
	</ProjectCard>
)

const ExistingProjectCard = ({
	project,
}: {
	project: IProjectWithArtboards
}) => (
	<ProjectCard title={project.name} description={project.description || ''}>
		<ProjectArtboards artboards={project.artboards} />
	</ProjectCard>
)

const ProjectArtboards = ({ artboards }: { artboards: IArtboard[] }) => {
	const artboardNames = artboards.map(artboard => artboard.name).join(', ')
	return (
		<CardContentBody>
			{artboards.length === 0 ? 'No artboards' : artboardNames}
		</CardContentBody>
	)
}
