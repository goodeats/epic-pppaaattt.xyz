import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '#app/components/ui/tabs'

export const NavTabs = () => {
	return (
		<Tabs defaultValue="artboard" className="flex-1">
			<div className="container h-full py-6">
				<div className="grid h-full items-stretch gap-6">
					<div className="hidden flex-col space-y-4 sm:flex md:order-2">
						<TabsList className="grid grid-cols-2">
							<TabsTrigger value="artboard">Artboard</TabsTrigger>
							<TabsTrigger value="layers">Layers</TabsTrigger>
						</TabsList>
						<TabsContent value="artboard">
							Make changes to your artboard here.
						</TabsContent>
						<TabsContent value="layers">Layers content</TabsContent>
					</div>
				</div>
			</div>
		</Tabs>
	)
}
