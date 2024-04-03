import {
	SidebarPanel,
	SidebarPanelHeader,
	SidebarPanelRow,
	SidebarPanelRowActionsContainer,
	SidebarPanelRowContainer,
	SidebarPanelRowReorderContainer,
	SidebarPanelRowValuesContainer,
} from '#app/components/templates'
import { type IDesignWithPalette } from '#app/models/design.server'
import { DesignTypeEnum } from '#app/schema/design'
import {
	panelItemVariablesDesignType,
	panelListVariablesDesignType,
	selectedDesignsOnUpdate,
} from '#app/utils/design'
import { capitalize } from '#app/utils/string-formatting'
import { type PickedArtboardType } from '../../../../queries'
import { PanelFormArtboardDesignDelete } from '../../../forms/artboard/design/panel-form-artboard-design-delete'
import { PanelFormArtboardDesignNew } from '../../../forms/artboard/design/panel-form-artboard-design-new'
import { PanelFormArtboardDesignReorder } from '../../../forms/artboard/design/panel-form-artboard-design-reorder'
import { PanelFormArtboardDesignToggleVisible } from '../../../forms/artboard/design/panel-form-artboard-design-toggle-visible'
import { PanelFormDesignPaletteEditValue } from '../../../forms/design/panel-form-design-palette-edit-value'
import { PanelPopoverDesignPalette } from '../../../popovers/design/panel-popover-design-palette'

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
			<SidebarPanelHeader title={capitalize(DesignTypeEnum.PALETTE)}>
				<SidebarPanelRowActionsContainer>
					<PanelFormArtboardDesignNew
						artboardId={artboard.id}
						type={DesignTypeEnum.PALETTE}
						visibleDesignsCount={visibleDesignIds.length}
					/>
				</SidebarPanelRowActionsContainer>
			</SidebarPanelHeader>
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
						<SidebarPanelRowReorderContainer>
							<PanelFormArtboardDesignReorder
								id={id}
								artboardId={artboard.id}
								panelCount={designCount}
								panelIndex={index}
								direction="up"
								updateSelectedDesignId={selectDesignIdOnMoveUp}
							/>
							<PanelFormArtboardDesignReorder
								id={id}
								artboardId={artboard.id}
								panelCount={designCount}
								panelIndex={index}
								direction="down"
								updateSelectedDesignId={selectDesignIdOnMoveDown}
							/>
						</SidebarPanelRowReorderContainer>
						<SidebarPanelRowContainer>
							<SidebarPanelRowValuesContainer>
								<PanelPopoverDesignPalette palette={palette} />
								<PanelFormDesignPaletteEditValue palette={palette} />
							</SidebarPanelRowValuesContainer>
							<SidebarPanelRowActionsContainer>
								<PanelFormArtboardDesignToggleVisible
									id={id}
									artboardId={artboard.id}
									visible={visible}
									updateSelectedDesignId={selectDesignIdOnToggleVisible}
								/>
								<PanelFormArtboardDesignDelete
									id={id}
									artboardId={artboard.id}
									isSelectedDesign={isSelectedDesign}
									updateSelectedDesignId={selectDesignIdOnDelete}
								/>
							</SidebarPanelRowActionsContainer>
						</SidebarPanelRowContainer>
					</SidebarPanelRow>
				)
			})}
		</SidebarPanel>
	)
}
