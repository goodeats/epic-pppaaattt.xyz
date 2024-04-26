import { Sidebar } from '#app/components/layout'
import { SidebarTabs, SidebarTabsContent } from '#app/components/templates'
import { type IArtboardVersionWithDesignsAndLayers } from '#app/models/artboard-version/artboard-version.server'
import { type ILayerWithDesigns } from '#app/models/layer.server'
import { PanelArtboardVersion } from './sidebars.panel.artboard-version'
import { PanelArtboardVersionLayers } from './sidebars.panel.artboard-version.layers'

export const SidebarLeft = ({
	version,
}: {
	version: IArtboardVersionWithDesignsAndLayers
}) => {
	return (
		<Sidebar id="sidebar-left">
			<SidebarTabs tabs={['display', 'assets']}>
				<SidebarTabsContent value="display">
					<PanelArtboardVersionLayers version={version} />
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
	selectedLayer,
}: {
	version: IArtboardVersionWithDesignsAndLayers
	selectedLayer: ILayerWithDesigns | undefined
}) => {
	return (
		<Sidebar id="sidebar-right">
			<SidebarTabs tabs={['designs', 'actions']}>
				<SidebarTabsContent value="designs">
					{selectedLayer && <p>yo</p>}
					<PanelArtboardVersion version={version} />
				</SidebarTabsContent>
				<SidebarTabsContent value="actions">Actions here</SidebarTabsContent>
			</SidebarTabs>
		</Sidebar>
	)
}
