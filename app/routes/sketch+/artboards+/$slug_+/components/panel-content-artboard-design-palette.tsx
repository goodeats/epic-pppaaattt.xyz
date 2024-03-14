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
	findFirstDesignIdInArray,
	getNextVisibleDesignId,
	parseArtboardSelectedDesigns,
} from '#app/utils/artboard'
import { orderDesigns } from '#app/utils/design'
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
	const orderedDesignPalettes = orderDesigns(
		designPalettes,
	) as IDesignWithPalette[]

	// helps with finding first visible design on toggle visible
	const orderedDesignIds = orderedDesignPalettes.map(design => design.id)

	// helps with disabling reorder buttons
	const designCount = designPalettes.length

	// helps with resetting the selected design for artboard
	const visibleDesignIds = orderedDesignPalettes
		.filter(design => design.visible)
		.map(design => design.id)

	// helps with knowing there is a first visible design
	const firstVisibleDesignId = visibleDesignIds[0]

	const selectedPaletteId = parseArtboardSelectedDesigns({ artboard }).paletteId

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
			{orderedDesignPalettes.map((designPalette, index) => {
				const { id, visible, palette } = designPalette

				const isSelectedDesign = id === selectedPaletteId

				const nextVisibleDesignId = getNextVisibleDesignId(visibleDesignIds, id)
				// const prevVisibleDesignId = getPrevVisibleDesignId(visibleDesignIds, id)

				const toggleVisibleChangeSelectedDesignId = visible
					? isSelectedDesign // if visible to not visible
						? nextVisibleDesignId // if selected, set to next
						: selectedPaletteId // if not selected, don't change
					: firstVisibleDesignId // if not visible to visible
					  ? findFirstDesignIdInArray(
								orderedDesignIds,
								firstVisibleDesignId,
								id,
					    ) // if first visible, set to first or self -- whichever is first
					  : id // if no prev visible, set to self

				const deleteChangeSelectedDesignId = isSelectedDesign
					? nextVisibleDesignId // if was selected, set to next visible
					: selectedPaletteId // don't change

				return (
					<PanelRow key={palette.id}>
						<PanelRowOrderContainer>
							<PanelFormArtboardDesignReorder
								id={id}
								artboardId={artboard.id}
								panelCount={designCount}
								panelIndex={index}
								direction="up"
							/>
							<PanelFormArtboardDesignReorder
								id={id}
								artboardId={artboard.id}
								panelCount={designCount}
								panelIndex={index}
								direction="down"
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
									updateSelectedDesignId={toggleVisibleChangeSelectedDesignId}
								/>
								<PanelFormArtboardDesignDelete
									id={id}
									artboardId={artboard.id}
									isSelectedDesign={isSelectedDesign}
									updateSelectedDesignId={deleteChangeSelectedDesignId}
								/>
							</PanelRowIconContainer>
						</PanelRowContainer>
					</PanelRow>
				)
			})}
		</Panel>
	)
}
