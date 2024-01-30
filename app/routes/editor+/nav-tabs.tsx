import { useLoaderData } from '@remix-run/react'
import { Separator } from '#app/components/ui/separator'
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '#app/components/ui/tabs'
import { ArtboardBackgroundColorForm } from './artboard-background-color-form'
import { ArtboardDimensionsForm } from './artboard-dimensions-form'
import { type loader } from './route'

export const NavTabs = () => {
	return (
		<Tabs defaultValue={'artboard'} className="flex-1">
			<div className="container h-full py-6">
				<div className="grid h-full items-stretch gap-6">
					<div className="hidden flex-col space-y-4 sm:flex md:order-2">
						<TabsList className={`grid grid-cols-${2}`}>
							<TabsTrigger value={'artboard'}>Artboard</TabsTrigger>
							<TabsTrigger value={'layers'}>Layers</TabsTrigger>
						</TabsList>
						<TabsContent value={'artboard'}>
							<NavContentArtboard />
						</TabsContent>
						<TabsContent value={'layers'}>
							Make changes to your artboard layers here.
						</TabsContent>
					</div>
				</div>
			</div>
		</Tabs>
	)
}

const NavContentArtboard = () => {
	const data = useLoaderData<typeof loader>()
	const { artboard } = data
	if (!artboard) return null

	const { project, description } = artboard

	return (
		<div className="grid h-full items-stretch gap-6">
			<div className="hidden flex-col space-y-4 sm:flex md:order-2">
				<div>
					<div className="text-sm text-muted-foreground">{project.name}</div>
					<div className="text-sm text-muted-foreground">{description}</div>
					<Separator className="my-4" />
					<ArtboardDimensionsForm artboard={artboard} />
					<ArtboardBackgroundColorForm artboard={artboard} />
				</div>
			</div>
		</div>
	)
}
