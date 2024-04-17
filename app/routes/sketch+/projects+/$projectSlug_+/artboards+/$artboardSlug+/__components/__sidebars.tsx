import { Sidebar } from '#app/components/layout'
import { SidebarTabs, SidebarTabsContent } from '#app/components/templates'
import { type IArtboardVersionWithDesignsAndLayers } from '#app/models/artboard-version/artboard-version.server'
import { PanelArtboardVersionDesigns } from './panels/artboard-version/__designs'

export const SidebarLeft = ({
	version,
}: {
	version: IArtboardVersionWithDesignsAndLayers
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
					<PanelArtboardVersionDesigns version={version} />
				</SidebarTabsContent>
				<SidebarTabsContent value="actions">Actions here</SidebarTabsContent>
			</SidebarTabs>
		</Sidebar>
	)
}
