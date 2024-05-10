import {
	SidebarPanel,
	SidebarPanelHeader,
	SidebarPanelRow,
	SidebarPanelRowContainer,
} from '#app/components/templates'
import { type PickedArtboardType } from '#app/models/artboard.server'
import { PanelFormArtboardEditBackgroundColor } from '../../forms/artboard/panel-form-artboard-edit-background-color'

export const PanelArtboardBackground = ({
	artboard,
}: {
	artboard: PickedArtboardType
}) => {
	return (
		<SidebarPanel>
			<SidebarPanelHeader title="Background Color" />
			<SidebarPanelRow>
				<SidebarPanelRowContainer>
					<PanelFormArtboardEditBackgroundColor artboard={artboard} />
				</SidebarPanelRowContainer>
			</SidebarPanelRow>
		</SidebarPanel>
	)
}
