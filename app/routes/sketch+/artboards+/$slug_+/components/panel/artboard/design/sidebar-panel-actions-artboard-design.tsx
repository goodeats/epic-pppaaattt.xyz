import { SidebarPanelRowActionsContainer } from '#app/components/templates'
import { type IDesign } from '#app/models/design.server'
import { type IArtboard } from '#app/utils/db.server'
import { PanelFormArtboardDesignDelete } from '../../../forms/artboard/design/panel-form-artboard-design-delete'
import { PanelFormArtboardDesignToggleVisible } from '../../../forms/artboard/design/panel-form-artboard-design-toggle-visible'

export const SidebarPanelActionsArtboardDesign = ({
	id,
	artboardId,
	visible,
	isSelectedDesign,
	selectDesignIdOnToggleVisible,
	selectDesignIdOnDelete,
}: {
	id: IDesign['id']
	artboardId: IArtboard['id']
	visible: boolean
	isSelectedDesign: boolean
	selectDesignIdOnToggleVisible: IDesign['id'] | null | undefined
	selectDesignIdOnDelete: IDesign['id'] | null | undefined
}) => {
	return (
		<SidebarPanelRowActionsContainer>
			<PanelFormArtboardDesignToggleVisible
				id={id}
				artboardId={artboardId}
				visible={visible}
				updateSelectedDesignId={selectDesignIdOnToggleVisible}
			/>
			<PanelFormArtboardDesignDelete
				id={id}
				artboardId={artboardId}
				isSelectedDesign={isSelectedDesign}
				updateSelectedDesignId={selectDesignIdOnDelete}
			/>
		</SidebarPanelRowActionsContainer>
	)
}
