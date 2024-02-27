import {
	SideNavTabsList,
	SideNavTabsTrigger,
	SideNavTabsWrapper,
} from '#app/components/shared'
import { TabsContent } from '#app/components/ui/tabs'
import { type PickedArtboardType } from '../queries'
import { PanelContentArtboard } from './panel-content-artboard'

export const PanelContent = ({
	artboard,
}: {
	artboard: PickedArtboardType
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
