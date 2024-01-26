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
import { useUser } from '#app/utils/user'
import { type loader } from './route'

export const Artboards = () => {
	return (
		<div>
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<h2 className="text-2xl font-semibold tracking-tight">Artboards</h2>
					<p className="text-sm text-muted-foreground">
						Current Artboards in this project
					</p>
				</div>
				<div className="ml-auto mr-4">
					<Button asChild>
						<Link to="artboards/new" prefetch="intent">
							<Icon name="plus">New Artboard</Icon>
						</Link>
					</Button>
				</div>
			</div>
			<Separator className="my-4" />
			<div className="relative">
				<ArtboardsTable />
			</div>
		</div>
	)
}

const ArtboardsTable = () => {
	const data = useLoaderData<typeof loader>()
	const user = useUser()
	const artboards = data.project.artboards

	return (
		<Table>
			<TableCaption>A list of your recent artboards.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Description</TableHead>
					<TableHead>Visible</TableHead>
					<TableHead>Dimensions</TableHead>
					<TableHead className="text-right">Last Updated</TableHead>
					<TableHead></TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{artboards.map(artboard => {
					const {
						name,
						description,
						isVisible,
						slug,
						width,
						height,
						updatedAt,
					} = artboard

					const date = new Date(updatedAt)
					const timeAgo = formatDistanceToNow(date)
					return (
						<TableRow key={slug}>
							<TableCell>{name}</TableCell>
							<TableCell>{description}</TableCell>
							<TableCell>{isVisible ? 'visible' : 'not visible'}</TableCell>
							<TableCell>
								{width}x{height}
							</TableCell>
							<TableCell className="text-right">{timeAgo} ago</TableCell>
							<TableCell className="text-right">
								<LinkButton to={`/users/${user.username}/artboards/${slug}`}>
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
