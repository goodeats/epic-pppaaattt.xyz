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
						<Link to="layers/assign" prefetch="intent">
							<Icon name="plus">Assign Layers</Icon>
						</Link>
					</Button>
				</div>
			</div>
			<Separator className="my-4" />
			<div className="relative">
				<LayersTable />
			</div>
		</div>
	)
}

const LayersTable = () => {
	const data = useLoaderData<typeof loader>()
	const { artboard } = data
	const { layers } = artboard
	const user = useUser()

	return (
		<Table>
			<TableCaption>A list of your artboard layers.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Order</TableHead>
					<TableHead>Visible</TableHead>
					<TableHead className="text-right">Last Updated</TableHead>
					<TableHead></TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{layers.map(layer => {
					const { order, isVisible } = layer
					const { name, description, slug, updatedAt } = layer.layer

					const date = new Date(updatedAt)
					const timeAgo = formatDistanceToNow(date)

					const LayerToolTip = () => {
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
								<LayerToolTip />
							</TableCell>
							<TableCell>{order}</TableCell>
							<TableCell>{isVisible ? 'visible' : 'not visible'}</TableCell>
							<TableCell className="text-right">{timeAgo} ago</TableCell>
							<TableCell className="text-right">
								<LinkButton to={`/users/${user.username}/layers/${slug}`}>
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