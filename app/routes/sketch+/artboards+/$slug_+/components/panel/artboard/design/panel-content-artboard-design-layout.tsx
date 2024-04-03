import {
	SidebarPanel,
	SidebarPanelHeader,
	SidebarPanelRow,
	SidebarPanelRowActionsContainer,
	SidebarPanelRowContainer,
	SidebarPanelRowReorderContainer,
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
import { capitalize } from '#app/utils/string-formatting'
import { type PickedArtboardType } from '../../../../queries'
import { PanelFormArtboardDesignDelete } from '../../../forms/artboard/design/panel-form-artboard-design-delete'
import { PanelFormArtboardDesignNew } from '../../../forms/artboard/design/panel-form-artboard-design-new'
import { PanelFormArtboardDesignReorder } from '../../../forms/artboard/design/panel-form-artboard-design-reorder'
import { PanelFormArtboardDesignToggleVisible } from '../../../forms/artboard/design/panel-form-artboard-design-toggle-visible'
import { PanelFormDesignLayoutEditCount } from '../../../forms/design/panel-form-design-layout-edit-count'
import { PanelPopoverDesignLayout } from '../../../popovers/design/panel-popover-design-layout'

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
			<SidebarPanelHeader title={capitalize(DesignTypeEnum.LAYOUT)}>
				<SidebarPanelRowActionsContainer>
					<PanelFormArtboardDesignNew
						artboardId={artboard.id}
						type={DesignTypeEnum.LAYOUT}
						visibleDesignsCount={visibleDesignIds.length}
					/>
				</SidebarPanelRowActionsContainer>
			</SidebarPanelHeader>
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
								<PanelPopoverDesignLayout layout={layout} />
								{layout.style === 'random' ? (
									<PanelFormDesignLayoutEditCount layout={layout} />
								) : (
									<SidebarPanelRowValuesDisabled
										value={`${layout.rows} x ${layout.columns}`}
									/>
								)}
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
									isSelectedDesign={false}
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
