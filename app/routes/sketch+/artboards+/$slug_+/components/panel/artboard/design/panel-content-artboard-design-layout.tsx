import {
	SidebarPanel,
	SidebarPanelRow,
	SidebarPanelRowContainer,
	SidebarPanelRowValuesContainer,
	SidebarPanelRowValuesDisabled,
} from '#app/components/templates'
import { type IDesignWithLayout } from '#app/models/design.server'
import { DesignTypeEnum } from '#app/schema/design'
import {
	panelItemVariablesDesignType,
	panelListVariablesDesignType,
	selectedDesignsOnUpdate,
} from '#app/utils/design'
import { type PickedArtboardType } from '../../../../queries'
import { PanelFormDesignLayoutEditCount } from '../../../forms/design/panel-form-design-layout-edit-count'
import { PanelPopoverDesignLayout } from '../../../popovers/design/panel-popover-design-layout'
import { SidebarPanelActionsArtboardDesign } from './sidebar-panel-actions-artboard-design'
import { SidebarPanelHeaderArtboardDesign } from './sidebar-panel-header-artboard-design'
import { SidebarPanelReorderArtboardDesign } from './sidebar-panel-reorder-artboard-design'

export const PanelContentArtboardDesignLayout = ({
	artboard,
	designLayouts,
}: {
	artboard: PickedArtboardType
	designLayouts: IDesignWithLayout[]
}) => {
	const {
		orderedDesignIds,
		designCount,
		visibleDesignIds,
		firstVisibleDesignId,
		selectedDesignId,
	} = panelListVariablesDesignType({
		designs: designLayouts,
	})

	return (
		<SidebarPanel>
			<SidebarPanelHeaderArtboardDesign
				type={DesignTypeEnum.LAYOUT}
				artboardId={artboard.id}
				visibleDesignsCount={visibleDesignIds.length}
			/>

			{designLayouts.map((design, index) => {
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
								<PanelPopoverDesignLayout layout={layout} />
								{layout.style === 'random' ? (
									<PanelFormDesignLayoutEditCount layout={layout} />
								) : (
									<SidebarPanelRowValuesDisabled
										value={`${layout.rows} x ${layout.columns}`}
									/>
								)}
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
