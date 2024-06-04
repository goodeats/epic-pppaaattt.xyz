import { memo, useCallback } from 'react'
import {
	SidebarPanel,
	SidebarPanelHeader,
	SidebarPanelRowActionsContainer,
} from '#app/components/templates'
import { type IArtworkVersionWithDesignsAndLayers } from '#app/models/artwork-version/artwork-version.server'
import { ArtworkVersionWatermark } from '#app/routes/resources+/api.v1+/artwork-version.update.watermark'

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

	return (
		<SidebarPanel>
			<SidebarPanelHeader title="Watermark">
				<SidebarPanelRowActionsContainer>
					{artworkVersionWatermarkToggle()}
				</SidebarPanelRowActionsContainer>
			</SidebarPanelHeader>
		</SidebarPanel>
	)
}
