import {
	SidebarPanel,
	SidebarPanelHeader,
	SidebarPanelRow,
	SidebarPanelRowContainer,
	SidebarPanelRowValuesContainer,
} from '#app/components/templates'
import { type IArtworkVersionWithDesignsAndLayers } from '#app/models/artwork-version/artwork-version.server'
import { ArtworkVersionWatermark } from '#app/routes/resources+/api.v1+/artwork-version.update.watermark'

export const PanelArtworkVersionWatermark = ({
	version,
}: {
	version: IArtworkVersionWithDesignsAndLayers
}) => {
	return (
		<SidebarPanel>
			<SidebarPanelHeader title="Watermark" />
			<SidebarPanelRow>
				<SidebarPanelRowContainer>
					<SidebarPanelRowValuesContainer>
						<ArtworkVersionWatermark version={version} />
					</SidebarPanelRowValuesContainer>
				</SidebarPanelRowContainer>
			</SidebarPanelRow>
		</SidebarPanel>
	)
}
