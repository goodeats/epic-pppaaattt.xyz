import {
	SidebarPanel,
	SidebarPanelRow,
	SidebarPanelRowContainer,
	SidebarPanelRowValuesContainer,
	SidebarPanelRowValuesDisabled,
} from '#app/components/templates'
import { type IDesignWithRotate } from '#app/models/design.server'
import { DesignTypeEnum } from '#app/schema/design'
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
import { PanelFormDesignRotateEditValue } from '../../../forms/design/panel-form-design-rotate-edit-value'
import { PanelPopoverDesignRotate } from '../../../popovers/design/panel-popover-design-rotate'
import { SidebarPanelActionsDesign } from '../../design/sidebar-panel-actions-design'
import { SidebarPanelHeaderDesign } from '../../design/sidebar-panel-header-design'
import { SidebarPanelReorderDesign } from '../../design/sidebar-panel-reorder-design'

export const PanelContentArtboardDesignRotate = ({
	artboard,
	designRotates,
}: {
	artboard: PickedArtboardType
	designRotates: IDesignWithRotate[]
}) => {
	const {
		orderedDesignIds,
		designCount,
		visibleDesignIds,
		firstVisibleDesignId,
		selectedDesignId,
	} = panelListVariablesDesignType({
		designs: designRotates,
	})

	return (
		<SidebarPanel>
			<SidebarPanelHeaderDesign
				type={DesignTypeEnum.ROTATE}
				artboardId={artboard.id}
				visibleDesignsCount={visibleDesignIds.length}
				intent={ARTBOARD_DESIGN_INTENT.artboardCreateDesign}
				schema={NewArtboardDesignSchema}
			/>

			{designRotates.map((design, index) => {
				const { id, visible, rotate } = design

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
					<SidebarPanelRow key={rotate.id}>
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
							{/* values */}
							<SidebarPanelRowValuesContainer>
								<PanelPopoverDesignRotate rotate={rotate} />
								{rotate.basis !== 'defined' ? (
									<SidebarPanelRowValuesDisabled value={rotate.basis} />
								) : (
									<PanelFormDesignRotateEditValue rotate={rotate} />
								)}
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
