import { Sidebar } from '#app/components/layout'
import { SidebarTabs, SidebarTabsContent } from '#app/components/templates'
import { type IDesignsByType } from '#app/models/design.server'
import { type ILayer } from '#app/models/layer.server'
import { type PickedArtboardType } from '../queries'
import { PanelActions } from './panel/actions/panel-actions'
import { PanelArtboardDesigns } from './panel/artboard/panel-artboard-designs'
import { PanelArtboardLayers } from './panel/artboard/panel-artboard-layers'
import { PanelLayerDesigns } from './panel/layer/panel-layer-designs'

export const SidebarLeft = ({
	artboard,
	layers,
}: {
	artboard: PickedArtboardType
	layers: ILayer[]
}) => {
	return (
		<Sidebar id="sidebar-left">
			<SidebarTabs tabs={['display', 'assets']}>
				<SidebarTabsContent value="display">
					<PanelArtboardLayers artboard={artboard} layers={layers} />
				</SidebarTabsContent>
				<SidebarTabsContent value="assets">
					Add assets like images here
				</SidebarTabsContent>
			</SidebarTabs>
		</Sidebar>
	)
}

export const SidebarRight = ({
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
		<Sidebar id="sidebar-right">
			<SidebarTabs tabs={['designs', 'actions']}>
				<SidebarTabsContent value="designs">
					{layerPanel ? (
						<PanelLayerDesigns layerId={layer.id} designs={layerDesigns} />
					) : (
						<PanelArtboardDesigns
							artboard={artboard}
							designs={artboardDesigns}
						/>
					)}
				</SidebarTabsContent>
				<SidebarTabsContent value="actions">
					<PanelActions />
				</SidebarTabsContent>
			</SidebarTabs>
		</Sidebar>
	)
}
