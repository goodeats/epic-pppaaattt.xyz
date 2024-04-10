import {
	SidebarPanel,
	SidebarPanelHeader,
	SidebarPanelRow,
	SidebarPanelRowContainer,
} from '#app/components/templates'
import { PanelFormActionsDownload } from '../../forms/actions/panel-form-actions-download'

export const PanelActionsDownload = ({}: {}) => {
	return (
		<SidebarPanel>
			<SidebarPanelHeader title="Download" />
			<SidebarPanelRow>
				<SidebarPanelRowContainer>
					<PanelFormActionsDownload />
				</SidebarPanelRowContainer>
			</SidebarPanelRow>
		</SidebarPanel>
	)
}
