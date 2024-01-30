import { useLoaderData } from '@remix-run/react'
import {
	SideNavTabContent,
	SideNavTabText,
	SideNavTabsWrapper,
} from '#app/components/shared'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '#app/components/ui/accordion'
import { Separator } from '#app/components/ui/separator'
import { TabsContent, TabsList, TabsTrigger } from '#app/components/ui/tabs'
import { AppearancesList } from './appearances-list'
import { ArtboardBackgroundColorForm } from './artboard-background-color-form'
import { ArtboardDimensionsForm } from './artboard-dimensions-form'
import { type loader } from './route'

export const NavTabs = () => {
	return (
		<SideNavTabsWrapper defaultValue="artboard">
			<TabsList className={`grid grid-cols-${2}`}>
				<TabsTrigger value="artboard">Artboard</TabsTrigger>
				<TabsTrigger value="layers">Layers</TabsTrigger>
			</TabsList>
			<TabsContent value="artboard">
				<NavContentArtboard />
			</TabsContent>
			<TabsContent value="layers">
				Make changes to your artboard layers here.
			</TabsContent>
		</SideNavTabsWrapper>
	)
}

const NavContentArtboard = () => {
	const data = useLoaderData<typeof loader>()
	const { artboard } = data
	if (!artboard) return null

	const { project, description } = artboard

	return (
		<SideNavTabContent>
			<SideNavTabText>{project.name}</SideNavTabText>
			<SideNavTabText>{description}</SideNavTabText>
			<Separator className="my-4" />
			<Accordion
				type="single"
				collapsible
				className="w-full"
				defaultValue="appearances"
			>
				<AccordionItem value="attributes">
					<AccordionTrigger className="bg-secondary px-4">
						Attributes
					</AccordionTrigger>
					<AccordionContent>
						<ArtboardDimensionsForm artboard={artboard} />
						<ArtboardBackgroundColorForm artboard={artboard} />
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="appearances">
					<AccordionTrigger className="bg-secondary px-4">
						Appearances
					</AccordionTrigger>
					<AccordionContent>
						<AppearancesList />
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</SideNavTabContent>
	)
}
