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
import { type PickedArtboardType } from '../queries'
import { PanelFormArtboardDesignDelete } from './panel-form-artboard-design-delete'
import { PanelFormArtboardDesignNewSize } from './panel-form-artboard-design-new-size'
import { PanelFormArtboardDesignReorder } from './panel-form-artboard-design-reorder'
import { PanelFormArtboardDesignToggleVisibility } from './panel-form-artboard-design-toggle-visibility'

export const PanelContentArtboardDesignSize = ({
	artboard,
	designSizes,
}: {
	artboard: PickedArtboardType
	designSizes: IDesignWithSize[]
}) => {
	const orderedDesignSizes = designSizes.reduce(
		(acc: IDesignWithSize[], designSize) => {
			if (!designSize.prevId) {
				acc.unshift(designSize) // Add the head of the list to the start
			} else {
				let currentDesignIndex = acc.findIndex(d => d.id === designSize.prevId)
				if (currentDesignIndex !== -1) {
					// Insert the designSize right after its predecessor
					acc.splice(currentDesignIndex + 1, 0, designSize)
				} else {
					// If predecessor is not found, add it to the end as a fallback
					acc.push(designSize)
				}
			}
			return acc
		},
		[],
	)

	const designCount = designSizes.length
	return (
		<Panel>
			<PanelHeader>
				<PanelTitle>Size</PanelTitle>
				<div className="flex flex-shrink">
					<PanelFormArtboardDesignNewSize artboardId={artboard.id} />
				</div>
			</PanelHeader>
			{orderedDesignSizes.map((designSize, index) => {
				const { id, visible, size } = designSize
				return (
					<PanelRow key={size.id}>
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
								<p>yo</p>
								{/* <PanelPopoverArtboardDesignPalette size={size} /> */}
								{/* <PanelFormArtboardDesignEditPalette
									artboardId={artboard.id}
									size={size}
								/> */}
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
								/>
							</PanelRowIconContainer>
						</PanelRowContainer>
					</PanelRow>
				)
			})}
		</Panel>
	)
}
