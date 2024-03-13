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
import { type IDesignWithStroke } from '#app/models/design.server'
import { type PickedArtboardType } from '../queries'
import { PanelFormArtboardDesignDelete } from './panel-form-artboard-design-delete'
import { PanelFormArtboardDesignEditStroke } from './panel-form-artboard-design-edit-stroke'
import { PanelFormArtboardDesignNewStroke } from './panel-form-artboard-design-new-stroke'
import { PanelFormArtboardDesignReorder } from './panel-form-artboard-design-reorder'
import { PanelFormArtboardDesignToggleVisibility } from './panel-form-artboard-design-toggle-visibility'
import { PanelPopoverArtboardDesignStroke } from './panel-popover-artboard-design-stroke'

export const PanelContentArtboardDesignStroke = ({
	artboard,
	designStrokes,
}: {
	artboard: PickedArtboardType
	designStrokes: IDesignWithStroke[]
}) => {
	const orderedDesignFills = designStrokes.reduce(
		(acc: IDesignWithStroke[], designStroke) => {
			if (!designStroke.prevId) {
				acc.unshift(designStroke) // Add the head of the list to the start
			} else {
				let currentDesignIndex = acc.findIndex(
					d => d.id === designStroke.prevId,
				)
				if (currentDesignIndex !== -1) {
					// Insert the designStroke right after its predecessor
					acc.splice(currentDesignIndex + 1, 0, designStroke)
				} else {
					// If predecessor is not found, add it to the end as a fallback
					acc.push(designStroke)
				}
			}
			return acc
		},
		[],
	)

	const designCount = designStrokes.length
	return (
		<Panel>
			<PanelHeader>
				<PanelTitle>Stroke</PanelTitle>
				<div className="flex flex-shrink">
					<PanelFormArtboardDesignNewStroke artboardId={artboard.id} />
				</div>
			</PanelHeader>
			{orderedDesignFills.map((designStroke, index) => {
				const { id, visible, stroke } = designStroke
				return (
					<PanelRow key={stroke.id}>
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
								<PanelPopoverArtboardDesignStroke
									artboardId={artboard.id}
									stroke={stroke}
								/>
								{/* this is a little buggy, but I can manage for now */}
								{stroke.style === 'none' ? (
									<Input
										type="text"
										className={'flex h-8'}
										disabled
										defaultValue="None"
									/>
								) : stroke.basis !== 'defined' ? (
									<Input
										type="text"
										className={'flex h-8'}
										disabled
										defaultValue={stroke.basis}
									/>
								) : (
									<PanelFormArtboardDesignEditStroke
										artboardId={artboard.id}
										stroke={stroke}
									/>
								)}
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
									isSelectedDesign={false}
									updateSelectedDesignId={null}
								/>
							</PanelRowIconContainer>
						</PanelRowContainer>
					</PanelRow>
				)
			})}
		</Panel>
	)
}
