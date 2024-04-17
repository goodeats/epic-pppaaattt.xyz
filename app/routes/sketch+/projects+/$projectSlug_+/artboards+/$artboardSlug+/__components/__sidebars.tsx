import { Sidebar } from '#app/components/layout'
import { SidebarTabs, SidebarTabsContent } from '#app/components/templates'
import { type IArtboardVersionWithDesignsAndLayers } from '#app/models/artboard-version/artboard-version.server'
import { type ILayer } from '#app/models/layer.server'

export const SidebarLeft = ({
	version,
	layers,
}: {
	version: IArtboardVersionWithDesignsAndLayers
	layers?: ILayer[]
}) => {
	return (
		<Sidebar id="sidebar-left">
			<SidebarTabs tabs={['display', 'assets']}>
				<SidebarTabsContent value="display">
					artboard layrs
					{/* <PanelArtboardLayers version={version} layers={layers} /> */}
				</SidebarTabsContent>
				<SidebarTabsContent value="assets">
					Add assets like images here
				</SidebarTabsContent>
			</SidebarTabs>
		</Sidebar>
	)
}

export const SidebarRight = ({
	version,
}: {
	version: IArtboardVersionWithDesignsAndLayers
}) => {
	return (
		<Sidebar id="sidebar-right">
			<SidebarTabs tabs={['designs', 'actions']}>
				<SidebarTabsContent value="designs">
					Designs here
					{/* {layerPanel ? (
						<PanelLayerDesigns layerId={layer.id} designs={layerDesigns} />
					) : (
						<PanelArtboardDesigns version={version} designs={artboardDesigns} />
					)} */}
				</SidebarTabsContent>
				<SidebarTabsContent value="actions">
					Actions here
					{/* <PanelActions /> */}
				</SidebarTabsContent>
			</SidebarTabs>
		</Sidebar>
	)
}
