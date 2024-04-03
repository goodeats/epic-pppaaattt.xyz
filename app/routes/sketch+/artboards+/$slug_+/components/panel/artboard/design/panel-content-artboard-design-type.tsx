import {
	SidebarPanel,
	SidebarPanelRow,
	SidebarPanelRowContainer,
	SidebarPanelRowValuesContainer,
} from '#app/components/templates'
import { type IDesignWithLayout } from '#app/models/design.server'
import { type designTypeEnum } from '#app/schema/design'
import {
	DeleteArtboardDesignSchema,
	NewArtboardDesignSchema,
	ReorderArtboardDesignSchema,
	ToggleVisibleArtboardDesignSchema,
} from '#app/schema/design-artboard'
import {
	panelItemVariablesDesignType,
	panelListVariablesDesignType,
	selectedDesignsOnUpdate,
} from '#app/utils/design'
import { ARTBOARD_DESIGN_INTENT } from '../../../../intent'
import { type PickedArtboardType } from '../../../../queries'
import { SidebarPanelActionsDesign } from '../../design/sidebar-panel-actions-design'
import { SidebarPanelHeaderDesign } from '../../design/sidebar-panel-header-design'
import { SidebarPanelReorderDesign } from '../../design/sidebar-panel-reorder-design'

export const PanelContentArtboardDesignType = ({
	artboard,
	designs,
	type,
}: {
	artboard: PickedArtboardType
	designs: IDesignWithLayout[]
	type: designTypeEnum
}) => {
	const {
		orderedDesignIds,
		designCount,
		visibleDesignIds,
		firstVisibleDesignId,
		selectedDesignId,
	} = panelListVariablesDesignType({
		designs,
	})

	return (
		<SidebarPanel>
			<SidebarPanelHeaderDesign
				type={type}
				artboardId={artboard.id}
				visibleDesignsCount={visibleDesignIds.length}
				intent={ARTBOARD_DESIGN_INTENT.artboardCreateDesign}
				schema={NewArtboardDesignSchema}
			/>

			{designs.map((design, index) => {
				const { id, visible, layout } = design

				const {
					isSelectedDesign,
					nextDesignId,
					prevDesignId,
					nextVisibleDesignId,
				} = panelItemVariablesDesignType({
					id,
					selectedDesignId,
					orderedDesignIds,
					visibleDesignIds,
				})

				const {
					selectDesignIdOnMoveUp,
					selectDesignIdOnMoveDown,
					selectDesignIdOnToggleVisible,
					selectDesignIdOnDelete,
				} = selectedDesignsOnUpdate({
					id,
					selectedDesignId,
					isSelectedDesign,
					visible,
					prevDesignId,
					nextDesignId,
					nextVisibleDesignId,
					firstVisibleDesignId,
					orderedDesignIds,
				})

				return (
					<SidebarPanelRow key={layout.id}>
						<SidebarPanelReorderDesign
							id={id}
							artboardId={artboard.id}
							designCount={designCount}
							panelIndex={index}
							selectDesignIdOnMoveUp={selectDesignIdOnMoveUp}
							selectDesignIdOnMoveDown={selectDesignIdOnMoveDown}
							intent={ARTBOARD_DESIGN_INTENT.artboardReorderDesign}
							schema={ReorderArtboardDesignSchema}
						/>
						<SidebarPanelRowContainer>
							<SidebarPanelRowValuesContainer>
								<p>children</p>
								{/* {children} */}
							</SidebarPanelRowValuesContainer>
							{/* actions */}
							<SidebarPanelActionsDesign
								id={id}
								artboardId={artboard.id}
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
			})}
		</SidebarPanel>
	)
}
