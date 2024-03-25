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
import { DesignTypeEnum } from '#app/schema/design'
import {
	panelItemVariablesDesignType,
	panelListVariablesDesignType,
	selectedDesignsOnUpdate,
} from '#app/utils/design'
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
		orderedDesigns,
		orderedDesignIds,
		designCount,
		visibleDesignIds,
		firstVisibleDesignId,
		selectedDesignId,
	} = panelListVariablesDesignType({
		designs: designLayouts,
		artboard,
		type: DesignTypeEnum.LAYOUT,
	})

	return (
		<Panel>
			<PanelHeader>
				<PanelTitle>Layout</PanelTitle>
				<div className="flex flex-shrink">
					<PanelFormArtboardDesignNew
						artboardId={artboard.id}
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
								<PanelPopoverDesignLayout layout={layout} />
								{layout.style === 'random' ? (
									<PanelFormDesignLayoutEditCount layout={layout} />
								) : (
									<Input
										type="text"
										className={'flex h-8'}
										disabled
										defaultValue={`${layout.rows} x ${layout.columns}`}
									/>
								)}
							</PanelRowValueContainer>
							<PanelRowIconContainer>
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
							</PanelRowIconContainer>
						</PanelRowContainer>
					</PanelRow>
				)
			})}
		</Panel>
	)
}
