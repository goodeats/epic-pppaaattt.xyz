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
import { type IDesignWithPalette } from '#app/models/design.server'
import { DesignTypeEnum } from '#app/schema/design'
import {
	getNextDesignId,
	getPrevDesignId,
	parseArtboardSelectedDesigns,
} from '#app/utils/artboard'
import {
	designsIdArray,
	filterVisibleDesigns,
	orderLinkedDesigns,
	selectedDesignToUpdateOnDelete,
	selectedDesignToUpdateOnMoveDown,
	selectedDesignToUpdateOnMoveUp,
	selectedDesignToUpdateOnToggleVisible,
} from '#app/utils/design'
import { type PickedArtboardType } from '../queries'
import { PanelFormArtboardDesignDelete } from './panel-form-artboard-design-delete'
import { PanelFormArtboardDesignEditPalette } from './panel-form-artboard-design-edit-palette'
import { PanelFormArtboardDesignNew } from './panel-form-artboard-design-new'
import { PanelFormArtboardDesignReorder } from './panel-form-artboard-design-reorder'
import { PanelFormArtboardDesignToggleVisibility } from './panel-form-artboard-design-toggle-visibility'
import { PanelPopoverArtboardDesignPalette } from './panel-popover-artboard-design-palette'

export const PanelContentArtboardDesignPalette = ({
	artboard,
	designPalettes,
}: {
	artboard: PickedArtboardType
	designPalettes: IDesignWithPalette[]
}) => {
	const orderedDesigns = orderLinkedDesigns(
		designPalettes,
	) as IDesignWithPalette[]

	// helps with finding first visible design on toggle visible
	const orderedDesignIds = designsIdArray(orderedDesigns)

	// helps with disabling reorder buttons
	const designCount = orderedDesigns.length

	// helps with resetting the selected design for artboard
	const visibleDesigns = filterVisibleDesigns(orderedDesigns)
	const visibleDesignIds = designsIdArray(visibleDesigns)

	// helps with knowing there is a visible design
	const firstVisibleDesignId = visibleDesignIds[0]

	const selectedDesignId = parseArtboardSelectedDesigns({ artboard }).paletteId
	if (selectedDesignId) {
		const sd = orderedDesigns.find(design => design.id === selectedDesignId)
		console.log('selected: ', sd?.palette?.value)
	}

	return (
		<Panel>
			<PanelHeader>
				<PanelTitle>Palette</PanelTitle>
				<div className="flex flex-shrink">
					<PanelFormArtboardDesignNew
						artboardId={artboard.id}
						type={DesignTypeEnum.PALETTE}
						visibleDesignsCount={visibleDesignIds.length}
					/>
				</div>
			</PanelHeader>
			{orderedDesigns.map((design, index) => {
				const { id, visible, palette } = design

				const isSelectedDesign = id === selectedDesignId

				const nextDesignId = getNextDesignId(orderedDesignIds, id)
				const prevDesignId = getPrevDesignId(orderedDesignIds, id)
				const nextVisibleDesignId = getNextDesignId(visibleDesignIds, id)

				const selectDesignIdOnMoveUp = selectedDesignToUpdateOnMoveUp({
					id,
					selectedDesignId,
					isSelectedDesign,
					visible,
					prevDesignId,
				})

				const selectDesignIdOnMoveDown = selectedDesignToUpdateOnMoveDown({
					selectedDesignId,
					isSelectedDesign,
					visible,
					nextDesignId,
					nextVisibleDesignId,
				})

				const selectDesignIdOnToggleVisible =
					selectedDesignToUpdateOnToggleVisible({
						id,
						selectedDesignId,
						isSelectedDesign,
						visible,
						firstVisibleDesignId,
						nextVisibleDesignId,
						orderedDesignIds,
					})

				const selectDesignIdOnDelete = selectedDesignToUpdateOnDelete({
					selectedDesignId,
					isSelectedDesign,
					nextVisibleDesignId,
				})

				return (
					<PanelRow key={palette.id}>
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
								<PanelPopoverArtboardDesignPalette palette={palette} />
								<PanelFormArtboardDesignEditPalette
									artboardId={artboard.id}
									palette={palette}
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
									isSelectedDesign={isSelectedDesign}
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
