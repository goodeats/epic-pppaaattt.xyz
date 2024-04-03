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
	panelItemVariablesDesignType,
	panelListVariablesDesignType,
	selectedDesignsOnUpdate,
} from '#app/utils/design'
import { type PickedArtboardType } from '../../../../queries'
import { PanelPopoverDesignTemplate } from '../../../popovers/design/panel-popover-design-template'
import { SidebarPanelActionsArtboardDesign } from './sidebar-panel-actions-artboard-design'
import { SidebarPanelHeaderArtboardDesign } from './sidebar-panel-header-artboard-design'
import { SidebarPanelReorderArtboardDesign } from './sidebar-panel-reorder-artboard-design'

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
			<SidebarPanelHeaderArtboardDesign
				type={DesignTypeEnum.TEMPLATE}
				artboardId={artboard.id}
				visibleDesignsCount={visibleDesignIds.length}
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
						<SidebarPanelReorderArtboardDesign
							id={id}
							artboardId={artboard.id}
							designCount={designCount}
							panelIndex={index}
							selectDesignIdOnMoveUp={selectDesignIdOnMoveUp}
							selectDesignIdOnMoveDown={selectDesignIdOnMoveDown}
						/>
						<SidebarPanelRowContainer>
							{/* values */}
							<SidebarPanelRowValuesContainer>
								<PanelPopoverDesignTemplate template={template} />
								<SidebarPanelRowValuesDisabled value={template.style} />
							</SidebarPanelRowValuesContainer>
							{/* actions */}
							<SidebarPanelActionsArtboardDesign
								id={id}
								artboardId={artboard.id}
								visible={visible}
								isSelectedDesign={isSelectedDesign}
								selectDesignIdOnToggleVisible={selectDesignIdOnToggleVisible}
								selectDesignIdOnDelete={selectDesignIdOnDelete}
							/>
						</SidebarPanelRowContainer>
					</SidebarPanelRow>
				)
			})}
		</SidebarPanel>
	)
}
