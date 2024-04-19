import {
	SidebarPanel,
	SidebarPanelHeader,
	SidebarPanelRow,
	SidebarPanelRowContainer,
} from '#app/components/templates'
import { type IArtboardVersionWithDesignsAndLayers } from '#app/models/artboard-version/artboard-version.server'
import { PanelFormArtboardVersionHeight } from '#app/routes/resources+/api.v1+/panel.form.artboard-version.height'
import { PanelFormArtboardVersionWidth } from '#app/routes/resources+/api.v1+/panel.form.artboard-version.width'

export const PanelArtboardVersionFrame = ({
	version,
}: {
	version: IArtboardVersionWithDesignsAndLayers
}) => {
	return (
		<SidebarPanel>
			<SidebarPanelHeader title="Frame" />
			<SidebarPanelRow>
				<SidebarPanelRowContainer>
					<PanelFormArtboardVersionWidth version={version} />
					<PanelFormArtboardVersionHeight version={version} />
				</SidebarPanelRowContainer>
			</SidebarPanelRow>
		</SidebarPanel>
	)
}
