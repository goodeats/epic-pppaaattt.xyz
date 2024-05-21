import {
	SidebarPanel,
	SidebarPanelHeader,
	SidebarPanelRow,
	SidebarPanelRowContainer,
	SidebarPanelRowValuesContainer,
} from '#app/components/templates'
import { type IArtboardVersionWithDesignsAndLayers } from '#app/models/artboard-version/artboard-version.server'
import { ArtboardVersionHeight } from '#app/routes/resources+/api.v1+/artboard-version.update.height'
import { ArtboardVersionWidth } from '#app/routes/resources+/api.v1+/artboard-version.update.width'

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
					<SidebarPanelRowValuesContainer>
						<ArtboardVersionWidth version={version} />
						<ArtboardVersionHeight version={version} />
					</SidebarPanelRowValuesContainer>
				</SidebarPanelRowContainer>
			</SidebarPanelRow>
		</SidebarPanel>
	)
}
