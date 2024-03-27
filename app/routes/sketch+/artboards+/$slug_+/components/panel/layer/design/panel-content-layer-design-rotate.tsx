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
import { type IDesignWithRotate } from '#app/models/design.server'
import { type ILayer } from '#app/models/layer.server'
import { DesignTypeEnum } from '#app/schema/design'
import { RotateBasisTypeEnum } from '#app/schema/rotate'
import {
	panelItemVariablesDesignType,
	panelListVariablesDesignType,
	selectedDesignsOnUpdate,
} from '#app/utils/design'
import { PanelFormDesignRotateEditValue } from '../../../forms/design/panel-form-design-rotate-edit-value'
import { PanelFormLayerDesignDelete } from '../../../forms/layer/design/panel-form-layer-design-delete'
import { PanelFormLayerDesignNew } from '../../../forms/layer/design/panel-form-layer-design-new'
import { PanelFormLayerDesignReorder } from '../../../forms/layer/design/panel-form-layer-design-reorder'
import { PanelFormLayerDesignToggleVisibile } from '../../../forms/layer/design/panel-form-layer-design-toggle-visible'
import { PanelDialogDesignRotate } from '../../../popovers/design/panel-dialog-design-rotate'

export const PanelContentLayerDesignRotate = ({
	layer,
	designRotates,
}: {
	layer: ILayer
	designRotates: IDesignWithRotate[]
}) => {
	const {
		orderedDesignIds,
		designCount,
		visibleDesignIds,
		firstVisibleDesignId,
		selectedDesignId,
	} = panelListVariablesDesignType({
		designs: designRotates,
	})

	return (
		<Panel>
			<PanelHeader>
				<PanelTitle>Rotate</PanelTitle>
				<div className="flex flex-shrink">
					<PanelFormLayerDesignNew
						layerId={layer.id}
						type={DesignTypeEnum.ROTATE}
						visibleDesignsCount={visibleDesignIds.length}
					/>
				</div>
			</PanelHeader>
			{designRotates.map((design, index) => {
				const { id, visible, rotate } = design

				const RotateBasisIcon = () => {
					if (rotate.basis !== RotateBasisTypeEnum.DEFINED) return null

					return (
						<div className="m-2 mr-0 flex h-8 w-8 items-center justify-center">
							<span className="text-body-xs leading-none">°</span>
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
					<PanelRow key={rotate.id}>
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
								{/* popover unusable behavior when select triggered */}
								{/* moves to top of page and prevents scroll  */}
								{/* potential here: https://github.com/radix-ui/primitives/issues/2122 */}
								{/* switching to dialog in the meantime as workaround */}
								{/* <PanelPopoverDesignRotate rotate={rotate} /> */}
								<PanelDialogDesignRotate rotate={rotate} />
								{rotate.basis !== 'defined' ? (
									<Input
										type="text"
										className={'flex h-8'}
										disabled
										defaultValue={rotate.basis}
									/>
								) : (
									<PanelFormDesignRotateEditValue rotate={rotate} />
								)}
								<RotateBasisIcon />
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
