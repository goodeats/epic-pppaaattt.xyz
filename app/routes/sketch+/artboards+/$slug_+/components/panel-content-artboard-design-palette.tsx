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
	const orderedDesignPalettes = designPalettes.reduce(
		(acc: IDesignWithPalette[], designPalette) => {
			if (!designPalette.prevId) {
				acc.unshift(designPalette) // Add the head of the list to the start
			} else {
				let currentDesignIndex = acc.findIndex(
					d => d.id === designPalette.prevId,
				)
				if (currentDesignIndex !== -1) {
					// Insert the designPalette right after its predecessor
					acc.splice(currentDesignIndex + 1, 0, designPalette)
				} else {
					// If predecessor is not found, add it to the end as a fallback
					acc.push(designPalette)
				}
			}
			return acc
		},
		[],
	)

	// helps with disabling reorder buttons
	const designCount = designPalettes.length

	console.log('orderedDesignPalettes', orderedDesignPalettes)
	// helps with resetting the selected design for artboard
	const visibleDesigns: string[] = []

	return (
		<Panel>
			<PanelHeader>
				<PanelTitle>Palette</PanelTitle>
				<div className="flex flex-shrink">
					{/* <PanelFormArtboardDesignNewPalette artboardId={artboard.id} /> */}
					<PanelFormArtboardDesignNew
						artboardId={artboard.id}
						type={DesignTypeEnum.PALETTE}
						visibleDesignsCount={visibleDesigns.length}
					/>
				</div>
			</PanelHeader>
			{orderedDesignPalettes.map((designPalette, index) => {
				const { id, visible, palette } = designPalette

				if (visible) {
					visibleDesigns.push(id)
				}

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
								/>
								<PanelFormArtboardDesignDelete
									id={id}
									artboardId={artboard.id}
									// isSelected={visibleDesigns[0] === id}
								/>
							</PanelRowIconContainer>
						</PanelRowContainer>
					</PanelRow>
				)
			})}
		</Panel>
	)
}
