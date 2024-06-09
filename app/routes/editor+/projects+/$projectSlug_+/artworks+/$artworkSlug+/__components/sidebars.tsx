import { Sidebar } from '#app/components/layout'
import { SidebarTabs, SidebarTabsContent } from '#app/components/templates'
import { type IArtworkVersionWithDesignsAndLayers } from '#app/models/artwork-version/artwork-version.server'
import { type ILayerWithDesigns } from '#app/models/layer/layer.server'
import { PanelArtworkVersion } from './sidebars.panel.artwork-version'
import { PanelArtworkVersionImages } from './sidebars.panel.artwork-version.images'
import { PanelArtworkVersionLayers } from './sidebars.panel.artwork-version.layers'
import { PanelLayer } from './sidebars.panel.layer'

export const SidebarLeft = ({
	version,
}: {
	version: IArtworkVersionWithDesignsAndLayers
}) => {
	return (
		<Sidebar className="hidden bg-muted lg:flex">
			<SidebarTabs tabs={['display', 'assets']} defaultValue="display">
				<SidebarTabsContent value="display">
					<PanelArtworkVersionLayers version={version} />
				</SidebarTabsContent>
				<SidebarTabsContent value="assets">
					<PanelArtworkVersionImages />
				</SidebarTabsContent>
			</SidebarTabs>
		</Sidebar>
	)
}

export const SidebarRight = ({
	version,
	selectedLayer,
}: {
	version: IArtworkVersionWithDesignsAndLayers
	selectedLayer: ILayerWithDesigns | undefined
}) => {
	return (
		<Sidebar className="hidden bg-muted lg:flex">
			<SidebarTabs tabs={['designs', 'history']}>
				<SidebarTabsContent value="designs">
					{selectedLayer ? (
						<PanelLayer layer={selectedLayer} />
					) : (
						<PanelArtworkVersion version={version} />
					)}
				</SidebarTabsContent>
				<SidebarTabsContent value="history">
					branch, version, edit, etc. history here
				</SidebarTabsContent>
			</SidebarTabs>
		</Sidebar>
	)
}
