import {
	SidebarPanel,
	SidebarPanelHeader,
	SidebarPanelRow,
	SidebarPanelRowContainer,
} from '#app/components/templates'
import { type IArtboardVersionWithDesignsAndLayers } from '#app/models/artboard-version/artboard-version.server'
import { PanelFormArtboardVersionBackground } from '#app/routes/resources+/panel.form.artboard-version.background'

export const PanelBackground = ({
	version,
}: {
	version: IArtboardVersionWithDesignsAndLayers
}) => {
	return (
		<SidebarPanel>
			<SidebarPanelHeader title="Background" />
			<SidebarPanelRow>
				<SidebarPanelRowContainer>
					<PanelFormArtboardVersionBackground version={version} />
				</SidebarPanelRowContainer>
			</SidebarPanelRow>
		</SidebarPanel>
	)
}
