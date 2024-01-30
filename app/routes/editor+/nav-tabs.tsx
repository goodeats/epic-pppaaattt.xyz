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

	const { description } = artboard

	return (
		<div className="grid h-full items-stretch gap-6">
			<div className="hidden flex-col space-y-4 sm:flex md:order-2">
				<div>
					<span className="w-12 rounded-md border border-transparent py-4 text-right text-sm text-muted-foreground hover:border-border">
						{description}
					</span>
					<Separator className="my-4" />
					<ArtboardDimensionsForm artboard={artboard} />
					<Separator className="my-4" />
					<ArtboardBackgroundColorForm artboard={artboard} />
				</div>
			</div>
		</div>
	)
}
