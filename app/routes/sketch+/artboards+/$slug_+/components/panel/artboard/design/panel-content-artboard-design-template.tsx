import {
	SidebarPanel,
	SidebarPanelRow,
	SidebarPanelRowContainer,
	SidebarPanelRowValuesContainer,
	SidebarPanelRowValuesDisabled,
} from '#app/components/templates'
import { type IDesignWithTemplate } from '#app/models/design.server'
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
import { PanelPopoverDesignTemplate } from '../../../popovers/design/panel-popover-design-template'
import { SidebarPanelActionsDesign } from '../../design/sidebar-panel-actions-design'
import { SidebarPanelHeaderDesign } from '../../design/sidebar-panel-header-design'
import { SidebarPanelReorderDesign } from '../../design/sidebar-panel-reorder-design'

export const PanelContentArtboardDesignTemplate = ({
	artboard,
	designTemplates,
}: {
	artboard: PickedArtboardType
	designTemplates: IDesignWithTemplate[]
}) => {
	const {
		orderedDesignIds,
		designCount,
		visibleDesignIds,
		firstVisibleDesignId,
		selectedDesignId,
	} = panelListVariablesDesignType({
		designs: designTemplates,
	})

	return (
		<SidebarPanel>
			<SidebarPanelHeaderDesign
				type={DesignTypeEnum.TEMPLATE}
				artboardId={artboard.id}
				visibleDesignsCount={visibleDesignIds.length}
				intent={ARTBOARD_DESIGN_INTENT.artboardCreateDesign}
				schema={NewArtboardDesignSchema}
			/>

			{designTemplates.map((design, index) => {
				const { id, visible, template } = design

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
					<SidebarPanelRow key={template.id}>
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
								<PanelPopoverDesignTemplate template={template} />
								<SidebarPanelRowValuesDisabled value={template.style} />
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
