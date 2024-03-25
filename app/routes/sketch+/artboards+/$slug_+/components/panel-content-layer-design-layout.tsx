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
import { type IDesignWithLayout } from '#app/models/design.server'
import { type ILayer } from '#app/models/layer.server'
import { DesignTypeEnum } from '#app/schema/design'
import {
	panelItemVariablesDesignType,
	panelListVariablesDesignType,
	selectedDesignsOnUpdate,
} from '#app/utils/design'
import { PanelFormLayerDesignDelete } from './forms/layer/design/panel-form-layer-design-delete'
import { PanelFormLayerDesignNew } from './forms/layer/design/panel-form-layer-design-new'
import { PanelFormLayerDesignReorder } from './forms/layer/design/panel-form-layer-design-reorder'
import { PanelFormLayerDesignToggleVisibile } from './forms/layer/design/panel-form-layer-design-toggle-visible'

export const PanelContentLayerDesignLayout = ({
	layer,
	designLayouts,
}: {
	layer: ILayer
	designLayouts: IDesignWithLayout[]
}) => {
	const {
		orderedDesigns,
		orderedDesignIds,
		designCount,
		visibleDesignIds,
		firstVisibleDesignId,
		selectedDesignId,
	} = panelListVariablesDesignType({
		designs: designLayouts,
		type: DesignTypeEnum.LAYOUT,
	})

	return (
		<Panel>
			<PanelHeader>
				<PanelTitle>Layout</PanelTitle>
				<div className="flex flex-shrink">
					<PanelFormLayerDesignNew
						layerId={layer.id}
						type={DesignTypeEnum.LAYOUT}
						visibleDesignsCount={visibleDesignIds.length}
					/>
				</div>
			</PanelHeader>
			{orderedDesigns.map((design, index) => {
				const { id, visible, layout } = design as IDesignWithLayout

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
					<PanelRow key={layout.id}>
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
								{/* <PanelPopoverArtboardDesignLayout
									artboardId={artboard.id}
									layout={layout}
								/> */}
								{layout.style === 'random' ? (
									// <PanelFormArtboardDesignEditLayoutCount
									// 	artboardId={artboard.id}
									// 	layout={layout}
									// />
									<Input
										type="text"
										className={'flex h-8'}
										disabled
										defaultValue="layer random"
									/>
								) : (
									<Input
										type="text"
										className={'flex h-8'}
										disabled
										defaultValue="Grid"
									/>
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
