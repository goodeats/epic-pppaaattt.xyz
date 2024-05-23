import { formatDistanceToNow } from 'date-fns'
import {
	DashboardCard,
	DashboardCardContent,
	DashboardCardWrapper,
} from '#app/components/layout'
import { ContainerContent, ContainerP } from '#app/components/shared'
import { ArtworkCanvas } from '#app/components/templates/canvas'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '#app/components/ui/dialog'
import { PanelIconButton } from '#app/components/ui/panel-icon-button'
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '#app/components/ui/table'
import { type IArtworkVersionWithGenerator } from '#app/models/artwork-version/artwork-version.server'
import { ArtworkVersionTogglePublished } from '#app/routes/resources+/api.v1+/artwork-version.update.published'
import { ArtworkVersionToggleStarred } from '#app/routes/resources+/api.v1+/artwork-version.update.starred'

export const StarredVersions = ({
	versions,
}: {
	versions: IArtworkVersionWithGenerator[]
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
										generator,
									} = version

									const branchName = branch?.name || 'No branch found'

									const timeAgo = publishedAt
										? formatDistanceToNow(new Date(publishedAt))
										: 'never' // I'm keeping "never ago"

									return (
										<TableRow key={id}>
											<TableCell>
												<Dialog>
													<DialogTrigger asChild>
														<PanelIconButton
															iconName="eye-open"
															iconText="View canvas"
														/>
													</DialogTrigger>
													<DialogContent className="sm:max-w-[425px]">
														<DialogHeader>
															<DialogTitle>
																{branchName} - {name}
															</DialogTitle>
															<DialogDescription>
																{description}
															</DialogDescription>
														</DialogHeader>
														<ArtworkCanvas generator={generator} />
														<DialogFooter>footer</DialogFooter>
													</DialogContent>
												</Dialog>
											</TableCell>
											<TableCell>{name}</TableCell>
											<TableCell>{description}</TableCell>
											<TableCell>{branchName}</TableCell>
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
