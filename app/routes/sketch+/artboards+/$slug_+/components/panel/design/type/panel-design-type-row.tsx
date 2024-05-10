import {
	SidebarPanelRow,
	SidebarPanelRowContainer,
} from '#app/components/templates'
import { type IArtboard } from '#app/models/artboard/artboard.server'
import { type IDesign, type IDesignIdOrNull } from '#app/models/design.server'
import { type ILayer } from '#app/models/layer.server'
import {
	DeleteArtboardDesignSchema,
	ReorderArtboardDesignSchema,
	ToggleVisibleArtboardDesignSchema,
} from '#app/schema/design-artboard'
import {
	DeleteLayerDesignSchema,
	ReorderLayerDesignSchema,
	ToggleVisibleLayerDesignSchema,
} from '#app/schema/design-layer'
import { ARTBOARD_DESIGN_INTENT, LAYER_DESIGN_INTENT } from '../../../../intent'
import { SidebarPanelActionsDesign } from '../../design/sidebar-panel-actions-design'
import { SidebarPanelReorderDesign } from '../../design/sidebar-panel-reorder-design'

export const PanelDesignTypeRow = ({
	id,
	artboardId,
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
	artboardId?: IArtboard['id']
	layerId?: ILayer['id']
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
	const reorderDesignIntent = artboardId
		? ARTBOARD_DESIGN_INTENT.artboardReorderDesign
		: LAYER_DESIGN_INTENT.layerReorderDesign

	const reorderDesignSchema = artboardId
		? ReorderArtboardDesignSchema
		: ReorderLayerDesignSchema

	const toggleVisibleDesignIntent = artboardId
		? ARTBOARD_DESIGN_INTENT.artboardToggleVisibleDesign
		: LAYER_DESIGN_INTENT.layerToggleVisibleDesign

	const toggleVisibleDesignSchema = artboardId
		? ToggleVisibleArtboardDesignSchema
		: ToggleVisibleLayerDesignSchema

	const deleteDesignIntent = artboardId
		? ARTBOARD_DESIGN_INTENT.artboardDeleteDesign
		: LAYER_DESIGN_INTENT.layerDeleteDesign

	const deleteDesignSchema = artboardId
		? DeleteArtboardDesignSchema
		: DeleteLayerDesignSchema

	return (
		<SidebarPanelRow>
			<SidebarPanelReorderDesign
				id={id}
				artboardId={artboardId}
				layerId={layerId}
				designCount={designCount}
				panelIndex={panelIndex}
				selectDesignIdOnMoveUp={selectDesignIdOnMoveUp}
				selectDesignIdOnMoveDown={selectDesignIdOnMoveDown}
				intent={reorderDesignIntent}
				schema={reorderDesignSchema}
			/>
			<SidebarPanelRowContainer>
				{/* unique design forms by type here */}
				{children}
				<SidebarPanelActionsDesign
					id={id}
					artboardId={artboardId}
					layerId={layerId}
					visible={visible}
					isSelectedDesign={isSelectedDesign}
					selectDesignIdOnToggleVisible={selectDesignIdOnToggleVisible}
					selectDesignIdOnDelete={selectDesignIdOnDelete}
					toggleVisibleIntent={toggleVisibleDesignIntent}
					toggleVisibleSchema={toggleVisibleDesignSchema}
					deleteIntent={deleteDesignIntent}
					deleteSchema={deleteDesignSchema}
				/>
			</SidebarPanelRowContainer>
		</SidebarPanelRow>
	)
}
