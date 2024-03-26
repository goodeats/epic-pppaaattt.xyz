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
import { Icon } from '#app/components/ui/icon'
import { type IDesignWithSize } from '#app/models/design.server'
import { type ILayer } from '#app/models/layer.server'
import { DesignTypeEnum } from '#app/schema/design'
import {
	sizeBasisIcon,
	type sizeBasisTypeEnum,
	sizeFormatIcon,
	type sizeFormatTypeEnum,
} from '#app/schema/size'
import {
	panelItemVariablesDesignType,
	panelListVariablesDesignType,
	selectedDesignsOnUpdate,
} from '#app/utils/design'
import { PanelFormDesignSizeEditValue } from '../../../forms/design/panel-form-design-size-edit-value'
import { PanelFormLayerDesignDelete } from '../../../forms/layer/design/panel-form-layer-design-delete'
import { PanelFormLayerDesignNew } from '../../../forms/layer/design/panel-form-layer-design-new'
import { PanelFormLayerDesignReorder } from '../../../forms/layer/design/panel-form-layer-design-reorder'
import { PanelFormLayerDesignToggleVisibile } from '../../../forms/layer/design/panel-form-layer-design-toggle-visible'
import { PanelPopoverDesignSize } from '../../../popovers/design/panel-popover-design-size'

export const PanelContentLayerDesignSize = ({
	layer,
	designSizes,
}: {
	layer: ILayer
	designSizes: IDesignWithSize[]
}) => {
	const {
		orderedDesignIds,
		designCount,
		visibleDesignIds,
		firstVisibleDesignId,
		selectedDesignId,
	} = panelListVariablesDesignType({
		designs: designSizes,
	})

	return (
		<Panel>
			<PanelHeader>
				<PanelTitle>Size</PanelTitle>
				<div className="flex flex-shrink">
					<PanelFormLayerDesignNew
						layerId={layer.id}
						type={DesignTypeEnum.SIZE}
						visibleDesignsCount={visibleDesignIds.length}
					/>
				</div>
			</PanelHeader>
			{designSizes.map((design, index) => {
				const { id, visible, size } = design
				console.log('size', size)

				const SizeFormatIcon = () => {
					const icon = sizeFormatIcon(size.format as sizeFormatTypeEnum)
					return (
						<div className="m-2 mr-0 flex h-8 w-8 items-center justify-center">
							<span className="text-body-xs leading-none">{icon}</span>
						</div>
					)
				}

				const SizeBasisIcon = () => {
					const icon = sizeBasisIcon(size.basis as sizeBasisTypeEnum)
					return (
						<div className="m-2 mr-0 flex h-8 w-8 items-center justify-center">
							<Icon name={icon}>
								<span className="sr-only">Size Basis: {size.basis}</span>
							</Icon>
						</div>
					)
				}

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
								<PanelPopoverDesignSize size={size} />
								<PanelFormDesignSizeEditValue size={size} />
								<SizeFormatIcon />
								<SizeBasisIcon />
							</PanelRowValueContainer>
							<PanelRowIconContainer>
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
