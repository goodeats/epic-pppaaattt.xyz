import {
	SidebarPanel,
	SidebarPanelHeader,
	SidebarPanelRow,
	SidebarPanelRowContainer,
	SidebarPanelRowValuesContainer,
} from '#app/components/templates'
import { type IArtworkVersionWithDesignsAndLayers } from '#app/models/artwork-version/artwork-version.server'
import { ArtworkVersionHeight } from '#app/routes/resources+/api.v1+/artwork-version.update.height'
import { ArtworkVersionWidth } from '#app/routes/resources+/api.v1+/artwork-version.update.width'

export const PanelArtworkVersionFrame = ({
	version,
}: {
	version: IArtworkVersionWithDesignsAndLayers
}) => {
	return (
		<SidebarPanel>
			<SidebarPanelHeader title="Frame" />
			<SidebarPanelRow>
				<SidebarPanelRowContainer>
					<SidebarPanelRowValuesContainer>
						<ArtworkVersionWidth version={version} />
						<ArtworkVersionHeight version={version} />
					</SidebarPanelRowValuesContainer>
				</SidebarPanelRowContainer>
			</SidebarPanelRow>
		</SidebarPanel>
	)
}
