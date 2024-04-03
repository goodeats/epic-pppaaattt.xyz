import { SidebarTabs, SidebarTabsContent } from '#app/components/templates'
import { type IDesignsByType } from '#app/models/design.server'
import { type ILayer } from '#app/models/layer.server'
import { type PickedArtboardType } from '../queries'
import { PanelContentArtboardDesigns } from './panel/artboard/panel-content-artboard-designs'
import { PanelContentArtboardLayers } from './panel/artboard/panel-content-artboard-layers'
import { PanelContentLayerDesigns } from './panel/layer/panel-content-layer-designs'

export const PanelContentLeft = ({
	artboard,
	layers,
}: {
	artboard: PickedArtboardType
	layers: ILayer[]
}) => {
	return (
		<SidebarTabs tabs={['layers', 'assets']}>
			<SidebarTabsContent value="layers">
				<PanelContentArtboardLayers artboard={artboard} layers={layers} />
			</SidebarTabsContent>
			<SidebarTabsContent value="assets">
				Add assets like images here
			</SidebarTabsContent>
		</SidebarTabs>
	)
}

export const PanelContentRight = ({
	artboard,
	artboardDesigns,
	layer,
	layerDesigns,
}: {
	artboard: PickedArtboardType
	artboardDesigns: IDesignsByType
	layer: ILayer | null | undefined
	layerDesigns: IDesignsByType | null | undefined
}) => {
	const layerPanel = layer && layerDesigns

	return (
		<SidebarTabs tabs={['designs', 'actions']}>
			<SidebarTabsContent value="designs">
				{layerPanel ? (
					<PanelContentLayerDesigns layer={layer} designs={layerDesigns} />
				) : (
					<PanelContentArtboardDesigns
						artboard={artboard}
						designs={artboardDesigns}
					/>
				)}
			</SidebarTabsContent>
			<SidebarTabsContent value="actions">
				Add actions like download and duplicate here
			</SidebarTabsContent>
		</SidebarTabs>
	)
}
