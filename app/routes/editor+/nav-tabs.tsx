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
import { AppearanceType } from '#app/utils/appearances'
import { AppearanceList } from './appearance-list'
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
	const { artboard, artboardAppearances } = data
	if (!artboard) return null

	const { project, description } = artboard

	return (
		<SideNavTabContent>
			<SideNavTabText>{project.name}</SideNavTabText>
			<SideNavTabText>{description}</SideNavTabText>
			<Separator className="my-4" />

			<SideNavTabText>Frame</SideNavTabText>
			<ArtboardDimensionsForm artboard={artboard} />
			<ArtboardBackgroundColorForm artboard={artboard} />

			<Separator className="my-4" />

			<SideNavTabText>Appearances</SideNavTabText>
			<Accordion
				type="multiple"
				className="w-full"
				defaultValue={['palette', 'stroke-style']}
			>
				<AccordionItem value="palette">
					<AccordionTrigger className="bg-secondary px-4">
						Palette
					</AccordionTrigger>
					<AccordionContent>
						<AppearanceList
							artboard={artboard}
							artboardAppearanceTypes={artboardAppearances.palette}
							appearanceType={AppearanceType.Palette}
						/>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="size">
					<AccordionTrigger className="bg-secondary px-4">
						Size
					</AccordionTrigger>
					<AccordionContent>
						<AppearanceList
							artboard={artboard}
							artboardAppearanceTypes={artboardAppearances.size}
							appearanceType={AppearanceType.Size}
						/>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="stroke-style">
					<AccordionTrigger className="bg-secondary px-4">
						Stroke Style
					</AccordionTrigger>
					<AccordionContent>
						<AppearanceList
							artboard={artboard}
							artboardAppearanceTypes={
								artboardAppearances[AppearanceType.StrokeStyle]
							}
							appearanceType={AppearanceType.StrokeStyle}
						/>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</SideNavTabContent>
	)
}
