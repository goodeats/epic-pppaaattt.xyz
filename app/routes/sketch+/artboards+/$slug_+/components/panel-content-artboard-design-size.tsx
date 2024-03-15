import {
	Panel,
	PanelHeader,
	PanelRow,
	PanelRowContainer,
	PanelRowIconContainer,
	PanelRowOrderContainer,
	PanelRowValueContainer,
	PanelTitle,
} from '#app/components/shared'
import { type IDesignWithSize } from '#app/models/design.server'
import { DesignTypeEnum } from '#app/schema/design'
import {
	panelItemVariablesDesignType,
	panelListVariablesDesignType,
	selectedDesignsOnUpdate,
} from '#app/utils/design'
import { type PickedArtboardType } from '../queries'
import { PanelFormArtboardDesignDelete } from './panel-form-artboard-design-delete'
import { PanelFormArtboardDesignEditSize } from './panel-form-artboard-design-edit-size'
import { PanelFormArtboardDesignNew } from './panel-form-artboard-design-new'
import { PanelFormArtboardDesignReorder } from './panel-form-artboard-design-reorder'
import { PanelFormArtboardDesignToggleVisibility } from './panel-form-artboard-design-toggle-visibility'
import { PanelPopoverArtboardDesignSize } from './panel-popover-artboard-design-size'

export const PanelContentArtboardDesignSize = ({
	artboard,
	designSizes,
}: {
	artboard: PickedArtboardType
	designSizes: IDesignWithSize[]
}) => {
	const {
		orderedDesigns,
		orderedDesignIds,
		designCount,
		visibleDesignIds,
		firstVisibleDesignId,
		selectedDesignId,
	} = panelListVariablesDesignType({
		designs: designSizes,
		artboard,
		type: DesignTypeEnum.SIZE,
	})

	return (
		<Panel>
			<PanelHeader>
				<PanelTitle>Size</PanelTitle>
				<div className="flex flex-shrink">
					<PanelFormArtboardDesignNew
						artboardId={artboard.id}
						type={DesignTypeEnum.SIZE}
						visibleDesignsCount={visibleDesignIds.length}
					/>
				</div>
			</PanelHeader>
			{orderedDesigns.map((design, index) => {
				const { id, visible, size } = design as IDesignWithSize

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
					<PanelRow key={size.id}>
						<PanelRowOrderContainer>
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
						</PanelRowOrderContainer>
						<PanelRowContainer>
							<PanelRowValueContainer>
								<PanelPopoverArtboardDesignSize size={size} />
								<PanelFormArtboardDesignEditSize
									artboardId={artboard.id}
									size={size}
								/>
							</PanelRowValueContainer>
							<PanelRowIconContainer>
								<PanelFormArtboardDesignToggleVisibility
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
							</PanelRowIconContainer>
						</PanelRowContainer>
					</PanelRow>
				)
			})}
		</Panel>
	)
}
