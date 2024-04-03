import {
	SidebarPanelRow,
	SidebarPanelRowContainer,
} from '#app/components/templates'
import { type IDesign, type IDesignIdOrNull } from '#app/models/design.server'
import {
	DeleteArtboardDesignSchema,
	ReorderArtboardDesignSchema,
	ToggleVisibleArtboardDesignSchema,
} from '#app/schema/design-artboard'
import { type IArtboard } from '#app/utils/db.server'
import { ARTBOARD_DESIGN_INTENT } from '../../../../intent'
import { SidebarPanelActionsDesign } from '../../design/sidebar-panel-actions-design'
import { SidebarPanelReorderDesign } from '../../design/sidebar-panel-reorder-design'

export const PanelArtboardDesignTypeRow = ({
	id,
	artboardId,
	designCount,
	panelIndex,
	visible,
	selectDesignIdOnMoveUp,
	selectDesignIdOnMoveDown,
	isSelectedDesign,
	selectDesignIdOnToggleVisible,
	selectDesignIdOnDelete,
	children,
}: {
	id: IDesign['id']
	artboardId: IArtboard['id']
	designCount: number
	panelIndex: number
	visible: boolean
	selectDesignIdOnMoveUp: IDesignIdOrNull
	selectDesignIdOnMoveDown: IDesignIdOrNull
	isSelectedDesign: boolean
	selectDesignIdOnToggleVisible: IDesignIdOrNull
	selectDesignIdOnDelete: IDesignIdOrNull
	children: React.ReactNode
}) => {
	return (
		<SidebarPanelRow>
			<SidebarPanelReorderDesign
				id={id}
				artboardId={artboardId}
				designCount={designCount}
				panelIndex={panelIndex}
				selectDesignIdOnMoveUp={selectDesignIdOnMoveUp}
				selectDesignIdOnMoveDown={selectDesignIdOnMoveDown}
				intent={ARTBOARD_DESIGN_INTENT.artboardReorderDesign}
				schema={ReorderArtboardDesignSchema}
			/>
			<SidebarPanelRowContainer>
				{/* unique design forms by type here */}
				{children}
				<SidebarPanelActionsDesign
					id={id}
					artboardId={artboardId}
					visible={visible}
					isSelectedDesign={isSelectedDesign}
					selectDesignIdOnToggleVisible={selectDesignIdOnToggleVisible}
					selectDesignIdOnDelete={selectDesignIdOnDelete}
					toggleVisibleIntent={
						ARTBOARD_DESIGN_INTENT.artboardToggleVisibleDesign
					}
					toggleVisibleSchema={ToggleVisibleArtboardDesignSchema}
					deleteIntent={ARTBOARD_DESIGN_INTENT.artboardDeleteDesign}
					deleteSchema={DeleteArtboardDesignSchema}
				/>
			</SidebarPanelRowContainer>
		</SidebarPanelRow>
	)
}
