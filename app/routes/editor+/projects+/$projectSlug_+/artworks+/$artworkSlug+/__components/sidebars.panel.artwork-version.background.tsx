import {
	SidebarPanel,
	SidebarPanelHeader,
	SidebarPanelRow,
	SidebarPanelRowContainer,
	SidebarPanelRowValuesContainer,
} from '#app/components/templates'
import { type IArtworkVersionWithChildren } from '#app/models/artwork-version/artwork-version.server'
import { ArtworkVersionBackground } from '#app/routes/resources+/api.v1+/artwork-version.update.background'

export const PanelArtworkVersionBackground = ({
	version,
}: {
	version: IArtworkVersionWithChildren
}) => {
	return (
		<SidebarPanel>
			<SidebarPanelHeader title="Background" />
			<SidebarPanelRow>
				<SidebarPanelRowContainer>
					<SidebarPanelRowValuesContainer>
						<ArtworkVersionBackground version={version} />
					</SidebarPanelRowValuesContainer>
				</SidebarPanelRowContainer>
			</SidebarPanelRow>
		</SidebarPanel>
	)
}
