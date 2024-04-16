import {
	DashboardCard,
	DashboardCardContent,
	DashboardCardFooter,
	DashboardCardFooterLink,
	DashboardCardNone,
	DashboardCardWrapper,
} from '#app/components/templates'
import { CardContent } from '#app/components/ui/card'
import { type IArtboard } from '#app/models/artboard.server'
import { type IProjectWithArtboards } from '#app/models/project/project.server'
import { useUser } from '#app/utils/user'

export const ProjectArtboardCards = ({
	project,
}: {
	project: IProjectWithArtboards
}) => {
	return (
		<div className="container">
			{project.artboards.length === 0 ? (
				<NoArtboards project={project} />
			) : (
				<ArtboardList project={project} />
			)}
		</div>
	)
}

const NoArtboards = ({ project }: { project: IProjectWithArtboards }) => {
	return (
		<DashboardCardWrapper>
			<NewArtboardCard project={project} />
			<DashboardCardNone>No projects found</DashboardCardNone>
		</DashboardCardWrapper>
	)
}

const ArtboardList = ({ project }: { project: IProjectWithArtboards }) => (
	<DashboardCardWrapper>
		<NewArtboardCard project={project} />
		{project.artboards.map(artboard => (
			<ExistingArtboardCard key={artboard.id} artboard={artboard} />
		))}
	</DashboardCardWrapper>
)

const NewArtboardCard = ({ project }: { project: IProjectWithArtboards }) => {
	const user = useUser()
	return (
		<DashboardCard title="New Artboard" description="Create a new artboard">
			<DashboardCardContent>
				Add a new artboard to your project.
			</DashboardCardContent>
			<DashboardCardFooter>
				<DashboardCardFooterLink
					to={`/users/${user.username}/projects/${project.slug}/artboards/new`}
					icon="plus"
				>
					New
				</DashboardCardFooterLink>
			</DashboardCardFooter>
		</DashboardCard>
	)
}

const ExistingArtboardCard = ({ artboard }: { artboard: IArtboard }) => {
	const user = useUser()

	return (
		<DashboardCard
			title={artboard.name}
			description={artboard.description || ''}
		>
			<CardContent>Visible: {artboard.isVisible ? 'Yes' : 'No'}</CardContent>
			<DashboardCardFooter>
				<DashboardCardFooterLink
					to={`/users/${user.username}/artboards/${artboard.slug}`}
					icon="pencil-1"
				>
					Edit
				</DashboardCardFooterLink>
				<DashboardCardFooterLink to={artboard.slug} icon="arrow-right">
					Go
				</DashboardCardFooterLink>
			</DashboardCardFooter>
		</DashboardCard>
	)
}
