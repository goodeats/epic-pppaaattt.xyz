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
import { type IDesignWithLine } from '#app/models/design.server'
import { type ILayer } from '#app/models/layer.server'
import { DesignTypeEnum } from '#app/schema/design'
import {
	lineBasisIcon,
	type lineBasisTypeEnum,
	lineFormatIcon,
	type lineFormatTypeEnum,
	LineFormatTypeEnum,
} from '#app/schema/line'
import {
	panelItemVariablesDesignType,
	panelListVariablesDesignType,
	selectedDesignsOnUpdate,
} from '#app/utils/design'
import { PanelFormDesignLineEditWidth } from '../../../forms/design/panel-form-design-line=edit-width'
import { PanelFormLayerDesignDelete } from '../../../forms/layer/design/panel-form-layer-design-delete'
import { PanelFormLayerDesignNew } from '../../../forms/layer/design/panel-form-layer-design-new'
import { PanelFormLayerDesignReorder } from '../../../forms/layer/design/panel-form-layer-design-reorder'
import { PanelFormLayerDesignToggleVisibile } from '../../../forms/layer/design/panel-form-layer-design-toggle-visible'
import { PanelDialogDesignLine } from '../../../popovers/design/panel-dialog-design-line'

export const PanelContentLayerDesignLine = ({
	layer,
	designLines,
}: {
	layer: ILayer
	designLines: IDesignWithLine[]
}) => {
	const {
		orderedDesignIds,
		designCount,
		visibleDesignIds,
		firstVisibleDesignId,
		selectedDesignId,
	} = panelListVariablesDesignType({
		designs: designLines,
	})

	return (
		<Panel>
			<PanelHeader>
				<PanelTitle>Line</PanelTitle>
				<div className="flex flex-shrink">
					<PanelFormLayerDesignNew
						layerId={layer.id}
						type={DesignTypeEnum.LINE}
						visibleDesignsCount={visibleDesignIds.length}
					/>
				</div>
			</PanelHeader>
			{designLines.map((design, index) => {
				const { id, visible, line } = design

				const LineFormatIcon = () => {
					const icon = lineFormatIcon(line.format as lineFormatTypeEnum)
					return (
						<div className="m-2 mr-0 flex h-8 w-8 items-center justify-center">
							<span className="text-body-xs leading-none">{icon}</span>
						</div>
					)
				}

				const LineBasisIcon = () => {
					if (line.format === LineFormatTypeEnum.PIXEL) return null

					const icon = lineBasisIcon(line.basis as lineBasisTypeEnum)
					return (
						<div className="m-2 mr-0 flex h-8 w-8 items-center justify-center">
							<Icon name={icon}>
								<span className="sr-only">Line Basis: {line.basis}</span>
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
					<PanelRow key={line.id}>
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
								{/* <PanelPopoverDesignLine line={line} /> */}
								<PanelDialogDesignLine line={line} />
								<PanelFormDesignLineEditWidth line={line} />
								<LineFormatIcon />
								<LineBasisIcon />
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
