import { Link } from '@remix-run/react'
import { Button } from '#app/components/ui/button'
import { Icon } from '#app/components/ui/icon'
import { Separator } from '#app/components/ui/separator'
import {
	Table,
	TableCaption,
	TableHead,
	TableHeader,
	TableRow,
} from '#app/components/ui/table'
// import { useUser } from '#app/utils/user'
// import { type loader } from './route'

export const Layers = () => {
	return (
		<div>
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<h2 className="text-2xl font-semibold tracking-tight">Layers</h2>
					<p className="text-sm text-muted-foreground">
						Current Layers in this artboard
					</p>
				</div>
				<div className="ml-auto mr-4">
					<Button asChild>
						<Link to="layers/add" prefetch="intent">
							<Icon name="plus">Add Layer</Icon>
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
	// const data = useLoaderData<typeof loader>()
	// const user = useUser()
	// const layers = data.artboard.layers

	return (
		<Table>
			<TableCaption>A list of your artboard layers.</TableCaption>
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
			{/* <TableBody>
				{layers.map(layer => {
					const {
						name,
						description,
						isVisible,
						slug,
						width,
						height,
						updatedAt,
					} = layer

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
			</TableBody> */}
		</Table>
	)
}
