import {
	SidebarPanel,
	SidebarPanelRow,
	SidebarPanelRowContainer,
	SidebarPanelRowValuesContainer,
} from '#app/components/templates'
import { type IDesignWithPalette } from '#app/models/design.server'
import { DesignTypeEnum } from '#app/schema/design'
import {
	panelItemVariablesDesignType,
	panelListVariablesDesignType,
	selectedDesignsOnUpdate,
} from '#app/utils/design'
import { type PickedArtboardType } from '../../../../queries'
import { PanelFormDesignPaletteEditValue } from '../../../forms/design/panel-form-design-palette-edit-value'
import { PanelPopoverDesignPalette } from '../../../popovers/design/panel-popover-design-palette'
import { SidebarPanelActionsArtboardDesign } from './sidebar-panel-actions-artboard-design'
import { SidebarPanelHeaderArtboardDesign } from './sidebar-panel-header-artboard-design'
import { SidebarPanelReorderArtboardDesign } from './sidebar-panel-reorder-artboard-design'

export const PanelContentArtboardDesignPalette = ({
	artboard,
	designPalettes,
}: {
	artboard: PickedArtboardType
	designPalettes: IDesignWithPalette[]
}) => {
	const {
		orderedDesignIds,
		designCount,
		visibleDesignIds,
		firstVisibleDesignId,
		selectedDesignId,
	} = panelListVariablesDesignType({
		designs: designPalettes,
	})

	return (
		<SidebarPanel>
			<SidebarPanelHeaderArtboardDesign
				type={DesignTypeEnum.PALETTE}
				artboardId={artboard.id}
				visibleDesignsCount={visibleDesignIds.length}
			/>

			{designPalettes.map((design, index) => {
				const { id, visible, palette } = design

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
					<SidebarPanelRow key={palette.id}>
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
								<PanelPopoverDesignPalette palette={palette} />
								<PanelFormDesignPaletteEditValue palette={palette} />
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
