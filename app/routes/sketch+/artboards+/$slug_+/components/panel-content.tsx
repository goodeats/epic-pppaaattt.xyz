import { type Artboard } from '@prisma/client'
import {
	SideNavTabsList,
	SideNavTabsTrigger,
	SideNavTabsWrapper,
} from '#app/components/shared'
import { TabsContent } from '#app/components/ui/tabs'
import { PanelContentArtboard } from './panel-content-artboard'

export const PanelContent = ({
	artboard,
}: {
	artboard: Pick<Artboard, 'width' | 'height' | 'backgroundColor'>
}) => {
	return (
		<SideNavTabsWrapper defaultValue="artboard">
			<SideNavTabsList cols={2}>
				<SideNavTabsTrigger value="artboard">Artboard</SideNavTabsTrigger>
				<SideNavTabsTrigger value="layers">Layers</SideNavTabsTrigger>
			</SideNavTabsList>
			<TabsContent value="artboard">
				<PanelContentArtboard artboard={artboard} />
			</TabsContent>
			<TabsContent value="layers">
				Make changes to your layers here.
			</TabsContent>
		</SideNavTabsWrapper>
	)
}
