import {
	SidebarPanel,
	SidebarPanelRow,
	SidebarPanelRowContainer,
	SidebarPanelRowValuesContainer,
	SidebarPanelRowValuesDisabled,
} from '#app/components/templates'
import { type IDesignWithStroke } from '#app/models/design.server'
import { DesignTypeEnum } from '#app/schema/design'
import {
	panelItemVariablesDesignType,
	panelListVariablesDesignType,
	selectedDesignsOnUpdate,
} from '#app/utils/design'
import { type PickedArtboardType } from '../../../../queries'
import { PanelFormDesignStrokeEditValue } from '../../../forms/design/panel-form-design-stroke-edit-value'
import { PanelPopoverDesignStroke } from '../../../popovers/design/panel-popover-design-stroke'
import { SidebarPanelActionsArtboardDesign } from './sidebar-panel-actions-artboard-design'
import { SidebarPanelHeaderArtboardDesign } from './sidebar-panel-header-artboard-design'
import { SidebarPanelReorderArtboardDesign } from './sidebar-panel-reorder-artboard-design'

export const PanelContentArtboardDesignStroke = ({
	artboard,
	designStrokes,
}: {
	artboard: PickedArtboardType
	designStrokes: IDesignWithStroke[]
}) => {
	const {
		orderedDesignIds,
		designCount,
		visibleDesignIds,
		firstVisibleDesignId,
		selectedDesignId,
	} = panelListVariablesDesignType({
		designs: designStrokes,
	})

	return (
		<SidebarPanel>
			<SidebarPanelHeaderArtboardDesign
				type={DesignTypeEnum.STROKE}
				artboardId={artboard.id}
				visibleDesignsCount={visibleDesignIds.length}
			/>

			{designStrokes.map((design, index) => {
				const { id, visible, stroke } = design

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
					<SidebarPanelRow key={stroke.id}>
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
								<PanelPopoverDesignStroke stroke={stroke} />
								{/* this is a little buggy, but I can manage for now */}
								{stroke.basis !== 'defined' ? (
									<SidebarPanelRowValuesDisabled value={stroke.basis} />
								) : (
									<PanelFormDesignStrokeEditValue stroke={stroke} />
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
