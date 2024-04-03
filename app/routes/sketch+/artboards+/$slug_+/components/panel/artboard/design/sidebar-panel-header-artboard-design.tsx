import {
	SidebarPanelHeader,
	SidebarPanelRowActionsContainer,
} from '#app/components/templates'
import { type designTypeEnum } from '#app/schema/design'
import { type IArtboard } from '#app/utils/db.server'
import { capitalize } from '#app/utils/string-formatting'
import { PanelFormArtboardDesignNew } from '../../../forms/artboard/design/panel-form-artboard-design-new'

export const SidebarPanelHeaderArtboardDesign = ({
	type,
	artboardId,
	visibleDesignsCount,
}: {
	type: designTypeEnum
	artboardId: IArtboard['id']
	visibleDesignsCount: number
}) => {
	return (
		<SidebarPanelHeader title={capitalize(type)}>
			<SidebarPanelRowActionsContainer>
				<PanelFormArtboardDesignNew
					artboardId={artboardId}
					type={type}
					visibleDesignsCount={visibleDesignsCount}
				/>
			</SidebarPanelRowActionsContainer>
		</SidebarPanelHeader>
	)
}
