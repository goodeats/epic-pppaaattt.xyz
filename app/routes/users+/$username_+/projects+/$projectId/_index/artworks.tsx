import { Link, useLoaderData } from '@remix-run/react'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '#app/components/ui/button'
import { Icon } from '#app/components/ui/icon'
import { LinkButton } from '#app/components/ui/link-button'
import { Separator } from '#app/components/ui/separator'
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '#app/components/ui/table'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '#app/components/ui/tooltip'
import { useUser } from '#app/utils/user'
import { type loader } from './route'

export const Artworks = () => {
	return (
		<div>
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<h2 className="text-2xl font-semibold tracking-tight">Artworks</h2>
					<p className="text-sm text-muted-foreground">
						Current Artworks in this project
					</p>
				</div>
				<div className="ml-auto mr-4">
					<Button asChild>
						<Link to="artworks/new" prefetch="intent">
							<Icon name="plus">New Artwork</Icon>
						</Link>
					</Button>
				</div>
			</div>
			<Separator className="my-4" />
			<div className="relative">
				<ArtworksTable />
			</div>
		</div>
	)
}

const ArtworksTable = () => {
	const data = useLoaderData<typeof loader>()
	const user = useUser()
	const artworks = data.project.artworks

	return (
		<Table>
			<TableCaption>A list of your recent artworks.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Visible</TableHead>
					<TableHead>Dimensions</TableHead>
					<TableHead className="text-right">Last Updated</TableHead>
					<TableHead></TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{artworks.map(artwork => {
					const {
						name,
						description,
						isVisible,
						slug,
						width,
						height,
						updatedAt,
					} = artwork

					const date = new Date(updatedAt)
					const timeAgo = formatDistanceToNow(date)

					const ArtworkToolTip = () => {
						return (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger>{name}</TooltipTrigger>
									<TooltipContent>{description}</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)
					}

					return (
						<TableRow key={slug}>
							<TableCell>
								<ArtworkToolTip />
							</TableCell>
							<TableCell>{isVisible ? 'visible' : 'not visible'}</TableCell>
							<TableCell>
								{width}x{height}
							</TableCell>
							<TableCell className="text-right">{timeAgo} ago</TableCell>
							<TableCell className="text-right">
								<LinkButton to={`/users/${user.username}/artworks/${slug}`}>
									<Icon name="arrow-right"></Icon>
								</LinkButton>
							</TableCell>
						</TableRow>
					)
				})}
			</TableBody>
		</Table>
	)
}
