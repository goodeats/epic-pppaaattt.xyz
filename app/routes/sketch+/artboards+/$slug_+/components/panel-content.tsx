import {
	SideNavTabsList,
	SideNavTabsTrigger,
	SideNavTabsWrapper,
} from '#app/components/shared'
import { TabsContent } from '#app/components/ui/tabs'
import { type IDesignWithType } from '#app/models/design.server'
import { type ILayer } from '#app/models/layer.server'
import { type PickedArtboardType } from '../queries'
import { PanelContentArtboard } from './panel-content-artboard'
import { PanelContentArtboardLayer } from './panel-content-artboard-layer'

export const PanelContentLeft = ({
	artboard,
	layers,
}: {
	artboard: PickedArtboardType
	layers: ILayer[]
}) => {
	return (
		<SideNavTabsWrapper defaultValue="layers">
			<SideNavTabsList cols={2}>
				<SideNavTabsTrigger value="layers">Layers</SideNavTabsTrigger>
				<SideNavTabsTrigger value="assets">Assets</SideNavTabsTrigger>
			</SideNavTabsList>
			<TabsContent value="layers">
				<PanelContentArtboardLayer artboard={artboard} layers={layers} />
			</TabsContent>
			<TabsContent value="assets">Add assets like images here</TabsContent>
		</SideNavTabsWrapper>
	)
}

export const PanelContentRight = ({
	artboard,
	artboardDesigns,
}: {
	artboard: PickedArtboardType
	artboardDesigns: IDesignWithType[]
}) => {
	return (
		<SideNavTabsWrapper defaultValue="artboard">
			<SideNavTabsList cols={2}>
				<SideNavTabsTrigger value="artboard">Designs</SideNavTabsTrigger>
				<SideNavTabsTrigger value="actions">Actions</SideNavTabsTrigger>
			</SideNavTabsList>
			<TabsContent value="artboard">
				<PanelContentArtboard
					artboard={artboard}
					artboardDesigns={artboardDesigns}
				/>
			</TabsContent>
			<TabsContent value="actions">
				Add actions like download and duplicate here
			</TabsContent>
		</SideNavTabsWrapper>
	)
}
