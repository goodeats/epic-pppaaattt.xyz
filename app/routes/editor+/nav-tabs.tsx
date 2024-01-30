import { useLoaderData } from '@remix-run/react'
import { Separator } from '#app/components/ui/separator'
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '#app/components/ui/tabs'
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

	const { description, width, height, backgroundColor } = artboard

	return (
		<div className="grid h-full items-stretch gap-6">
			<div className="hidden flex-col space-y-4 sm:flex md:order-2">
				<div>
					<p>{description}</p>
					<Separator className="my-4" />
					<p>
						{width} x {height}
					</p>
					<p>{backgroundColor}</p>
					<Separator className="my-4" />
					<ArtboardDimensionsForm artboard={artboard} />
				</div>
			</div>
		</div>
	)
}
