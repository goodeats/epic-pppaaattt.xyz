import {
	SideNavTabsList,
	SideNavTabsTrigger,
	SideNavTabsWrapper,
} from '#app/components/shared'
import { TabsContent } from '#app/components/ui/tabs'
import {
	type IDesignsByType,
	type IDesignWithType,
} from '#app/models/design.server'
import { type ILayer } from '#app/models/layer.server'
import { type PickedArtboardType } from '../queries'
import { PanelContentArtboardDesigns } from './panel-content-artboard-designs'
import { PanelContentArtboardLayer } from './panel-content-artboard-layer'
import { PanelContentLayerDesigns } from './panel-content-layer-designs'

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
	layer,
	layerDesigns,
}: {
	artboard: PickedArtboardType
	artboardDesigns: IDesignWithType[]
	layer: ILayer | null | undefined
	layerDesigns: IDesignsByType | null | undefined
}) => {
	const layerPanel = layer && layerDesigns
	return (
		<SideNavTabsWrapper defaultValue="designs">
			<SideNavTabsList cols={2}>
				<SideNavTabsTrigger value="designs">Designs</SideNavTabsTrigger>
				<SideNavTabsTrigger value="actions">Actions</SideNavTabsTrigger>
			</SideNavTabsList>
			<TabsContent value="designs">
				{layerPanel ? (
					<PanelContentLayerDesigns layer={layer} designs={layerDesigns} />
				) : (
					<PanelContentArtboardDesigns
						artboard={artboard}
						artboardDesigns={artboardDesigns}
					/>
				)}
			</TabsContent>
			<TabsContent value="actions">
				Add actions like download and duplicate here
			</TabsContent>
		</SideNavTabsWrapper>
	)
}
