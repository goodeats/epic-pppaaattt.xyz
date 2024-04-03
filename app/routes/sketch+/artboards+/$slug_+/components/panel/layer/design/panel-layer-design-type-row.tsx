import {
	SidebarPanelRow,
	SidebarPanelRowContainer,
} from '#app/components/templates'
import { type IDesign, type IDesignIdOrNull } from '#app/models/design.server'
import { type ILayer } from '#app/models/layer.server'
import {
	DeleteLayerDesignSchema,
	ReorderLayerDesignSchema,
	ToggleVisibleLayerDesignSchema,
} from '#app/schema/design-layer'
import { LAYER_DESIGN_INTENT } from '../../../../intent'
import { SidebarPanelActionsDesign } from '../../design/sidebar-panel-actions-design'
import { SidebarPanelReorderDesign } from '../../design/sidebar-panel-reorder-design'

export const PanelLayerDesignTypeRow = ({
	id,
	layerId,
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
	layerId: ILayer['id']
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
				layerId={layerId}
				designCount={designCount}
				panelIndex={panelIndex}
				selectDesignIdOnMoveUp={selectDesignIdOnMoveUp}
				selectDesignIdOnMoveDown={selectDesignIdOnMoveDown}
				intent={LAYER_DESIGN_INTENT.layerReorderDesign}
				schema={ReorderLayerDesignSchema}
			/>
			<SidebarPanelRowContainer>
				{/* unique design forms by type here */}
				{children}
				<SidebarPanelActionsDesign
					id={id}
					layerId={layerId}
					visible={visible}
					isSelectedDesign={isSelectedDesign}
					selectDesignIdOnToggleVisible={selectDesignIdOnToggleVisible}
					selectDesignIdOnDelete={selectDesignIdOnDelete}
					toggleVisibleIntent={LAYER_DESIGN_INTENT.layerToggleVisibleDesign}
					toggleVisibleSchema={ToggleVisibleLayerDesignSchema}
					deleteIntent={LAYER_DESIGN_INTENT.layerDeleteDesign}
					deleteSchema={DeleteLayerDesignSchema}
				/>
			</SidebarPanelRowContainer>
		</SidebarPanelRow>
	)
}
