import { memo, useCallback } from 'react'
import {
	SidebarPanel,
	SidebarPanelHeader,
	SidebarPanelRow,
	SidebarPanelRowActionsContainer,
	SidebarPanelRowContainer,
	SidebarPanelRowValuesContainer,
} from '#app/components/templates'
import { type IArtworkVersionWithDesignsAndLayers } from '#app/models/artwork-version/artwork-version.server'
import { ArtworkVersionWatermark } from '#app/routes/resources+/api.v1+/artwork-version.update.watermark'
import { ArtworkVersionWatermarkColor } from '#app/routes/resources+/api.v1+/artwork-version.update.watermark-color'

const WatermarkToggle = memo(
	({ version }: { version: IArtworkVersionWithDesignsAndLayers }) => {
		return <ArtworkVersionWatermark version={version} />
	},
)
WatermarkToggle.displayName = 'WatermarkToggle'

export const PanelArtworkVersionWatermark = ({
	version,
}: {
	version: IArtworkVersionWithDesignsAndLayers
}) => {
	const artworkVersionWatermarkToggle = useCallback(
		() => <WatermarkToggle version={version} />,
		[version],
	)

	// could add a popover here and add a whole lot of font settings
	return (
		<SidebarPanel>
			<SidebarPanelHeader title="Watermark">
				<SidebarPanelRowActionsContainer>
					{artworkVersionWatermarkToggle()}
				</SidebarPanelRowActionsContainer>
			</SidebarPanelHeader>
			<SidebarPanelRow>
				<SidebarPanelRowContainer>
					<SidebarPanelRowValuesContainer>
						<ArtworkVersionWatermarkColor version={version} />
					</SidebarPanelRowValuesContainer>
				</SidebarPanelRowContainer>
			</SidebarPanelRow>
		</SidebarPanel>
	)
}
