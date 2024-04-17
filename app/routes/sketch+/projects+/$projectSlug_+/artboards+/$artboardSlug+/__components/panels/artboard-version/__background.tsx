import {
	SidebarPanel,
	SidebarPanelHeader,
	SidebarPanelRow,
	SidebarPanelRowContainer,
} from '#app/components/templates'
import { type IArtboardVersionWithDesignsAndLayers } from '#app/models/artboard-version/artboard-version.server'

export const PanelBackground = ({
	version,
}: {
	version: IArtboardVersionWithDesignsAndLayers
}) => {
	return (
		<SidebarPanel>
			<SidebarPanelHeader title="Background Color" />
			<SidebarPanelRow>
				<SidebarPanelRowContainer>
					background color
					{/* <PanelFormArtboardEditBackgroundColor version={version} /> */}
				</SidebarPanelRowContainer>
			</SidebarPanelRow>
		</SidebarPanel>
	)
}
