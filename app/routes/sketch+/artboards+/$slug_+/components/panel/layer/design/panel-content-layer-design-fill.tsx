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
import { Input } from '#app/components/ui/input'
import { type IDesignWithFill } from '#app/models/design.server'
import { type ILayer } from '#app/models/layer.server'
import { DesignTypeEnum } from '#app/schema/design'
import {
	panelItemVariablesDesignType,
	panelListVariablesDesignType,
	selectedDesignsOnUpdate,
} from '#app/utils/design'
import { PanelFormDesignFillEditValue } from '../../../forms/design/panel-form-design-fill-edit-value'
import { PanelFormLayerDesignDelete } from '../../../forms/layer/design/panel-form-layer-design-delete'
import { PanelFormLayerDesignNew } from '../../../forms/layer/design/panel-form-layer-design-new'
import { PanelFormLayerDesignReorder } from '../../../forms/layer/design/panel-form-layer-design-reorder'
import { PanelFormLayerDesignToggleVisibile } from '../../../forms/layer/design/panel-form-layer-design-toggle-visible'
import { PanelPopoverDesignFill } from '../../../popovers/design/panel-popover-design-fill'

export const PanelContentLayerDesignFill = ({
	layer,
	designFills,
}: {
	layer: ILayer
	designFills: IDesignWithFill[]
}) => {
	const {
		orderedDesigns,
		orderedDesignIds,
		designCount,
		visibleDesignIds,
		firstVisibleDesignId,
		selectedDesignId,
	} = panelListVariablesDesignType({
		designs: designFills,
		type: DesignTypeEnum.FILL,
	})

	return (
		<Panel>
			<PanelHeader>
				<PanelTitle>Fill</PanelTitle>
				<div className="flex flex-shrink">
					<PanelFormLayerDesignNew
						layerId={layer.id}
						type={DesignTypeEnum.FILL}
						visibleDesignsCount={visibleDesignIds.length}
					/>
				</div>
			</PanelHeader>
			{orderedDesigns.map((design, index) => {
				const { id, visible, fill } = design as IDesignWithFill

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
					<PanelRow key={fill.id}>
						<PanelRowOrderContainer>
							<PanelFormLayerDesignReorder
								id={id}
								layerId={layer.id}
								panelCount={designCount}
								panelIndex={index}
								direction="up"
								updateSelectedDesignId={selectDesignIdOnMoveUp}
							/>
							<PanelFormLayerDesignReorder
								id={id}
								layerId={layer.id}
								panelCount={designCount}
								panelIndex={index}
								direction="down"
								updateSelectedDesignId={selectDesignIdOnMoveDown}
							/>
						</PanelRowOrderContainer>
						<PanelRowContainer>
							<PanelRowValueContainer>
								<PanelPopoverDesignFill fill={fill} />
								{/* this is a little buggy, but I can manage for now */}
								{fill.style === 'none' ? (
									<Input
										type="text"
										className={'flex h-8'}
										disabled
										defaultValue="No Fill"
									/>
								) : fill.basis !== 'defined' ? (
									<Input
										type="text"
										className={'flex h-8'}
										disabled
										defaultValue={fill.basis}
									/>
								) : (
									<PanelFormDesignFillEditValue fill={fill} />
								)}
							</PanelRowValueContainer>
							<PanelRowIconContainer>
								<div></div>
								<PanelFormLayerDesignToggleVisibile
									id={id}
									layerId={layer.id}
									visible={visible}
									updateSelectedDesignId={selectDesignIdOnToggleVisible}
								/>
								<PanelFormLayerDesignDelete
									id={id}
									layerId={layer.id}
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
