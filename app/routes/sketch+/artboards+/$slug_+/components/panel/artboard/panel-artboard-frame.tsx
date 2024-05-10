import {
	SidebarPanel,
	SidebarPanelHeader,
	SidebarPanelRow,
	SidebarPanelRowContainer,
} from '#app/components/templates'
import { type IArtboard } from '#app/models/artboard/artboard.server'
import { PanelFormArtboardEditHeight } from '../../forms/artboard/panel-form-artboard-edit-height'
import { PanelFormArtboardEditWidth } from '../../forms/artboard/panel-form-artboard-edit-width'

export const PanelArtboardFrame = ({ artboard }: { artboard: IArtboard }) => {
	return (
		<SidebarPanel>
			<SidebarPanelHeader title="Frame" />
			<SidebarPanelRow>
				<SidebarPanelRowContainer>
					{/* 2 cols */}
					<PanelFormArtboardEditWidth artboard={artboard} />
					<PanelFormArtboardEditHeight artboard={artboard} />
				</SidebarPanelRowContainer>
			</SidebarPanelRow>
		</SidebarPanel>
	)
}
