import { formatDistanceToNow } from 'date-fns'
import {
	DashboardCard,
	DashboardCardContent,
	DashboardCardWrapper,
} from '#app/components/layout'
import { ContainerContent, ContainerP } from '#app/components/shared'
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '#app/components/ui/table'
import { type IArtworkVersionWithBranch } from '#app/models/artwork-version/artwork-version.server'
import { ArtworkVersionTogglePublished } from '#app/routes/resources+/api.v1+/artwork-version.update.published'
import { ArtworkVersionToggleStarred } from '#app/routes/resources+/api.v1+/artwork-version.update.starred'

export const StarredVersions = ({
	versions,
}: {
	versions: IArtworkVersionWithBranch[]
}) => {
	if (versions.length === 0) {
		return (
			<ContainerContent>
				<ContainerP>No starred versions</ContainerP>
			</ContainerContent>
		)
	}
	return (
		<ContainerContent>
			<DashboardCardWrapper>
				<DashboardCard
					title="Starred Versions"
					description="Make changes to Published and/or Starred status"
					className="w-full"
				>
					<DashboardCardContent>
						<Table>
							<TableCaption>Starred versions.</TableCaption>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Description</TableHead>
									<TableHead>Branch</TableHead>
									<TableHead>Published</TableHead>
									<TableHead className="text-right">Publish Date</TableHead>
									<TableHead></TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{versions.map(version => {
									const {
										id,
										name,
										description,
										published,
										publishedAt,
										branch,
									} = version

									const timeAgo = publishedAt
										? formatDistanceToNow(new Date(publishedAt))
										: 'never'

									return (
										<TableRow key={id}>
											<TableCell>{name}</TableCell>
											<TableCell>{description}</TableCell>
											<TableCell>{branch.name}</TableCell>
											<TableCell>
												{published ? 'published' : 'not published'}
											</TableCell>
											<TableCell className="text-right">
												{timeAgo} ago
											</TableCell>
											<TableCell className="text-right">
												<div className="flex gap-2">
													<ArtworkVersionToggleStarred version={version} />
													<ArtworkVersionTogglePublished version={version} />
												</div>
											</TableCell>
										</TableRow>
									)
								})}
							</TableBody>
						</Table>
					</DashboardCardContent>
				</DashboardCard>
			</DashboardCardWrapper>
		</ContainerContent>
	)
}
