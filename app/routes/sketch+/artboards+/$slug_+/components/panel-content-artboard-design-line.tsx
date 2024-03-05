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
import { type IDesignWithLine } from '#app/models/design.server'
import { type PickedArtboardType } from '../queries'
import { PanelFormArtboardDesignDelete } from './panel-form-artboard-design-delete'
import { PanelFormArtboardDesignEditLine } from './panel-form-artboard-design-edit-line'
import { PanelFormArtboardDesignNewLine } from './panel-form-artboard-design-new-line'
import { PanelFormArtboardDesignReorder } from './panel-form-artboard-design-reorder'
import { PanelFormArtboardDesignToggleVisibility } from './panel-form-artboard-design-toggle-visibility'
import { PanelPopoverArtboardDesignLine } from './panel-popover-artboard-design-line'

export const PanelContentArtboardDesignLine = ({
	artboard,
	designLines,
}: {
	artboard: PickedArtboardType
	designLines: IDesignWithLine[]
}) => {
	const orderedDesignLines = designLines.reduce(
		(acc: IDesignWithLine[], designLine) => {
			if (!designLine.prevId) {
				acc.unshift(designLine) // Add the head of the list to the start
			} else {
				let currentDesignIndex = acc.findIndex(d => d.id === designLine.prevId)
				if (currentDesignIndex !== -1) {
					// Insert the designLine right after its predecessor
					acc.splice(currentDesignIndex + 1, 0, designLine)
				} else {
					// If predecessor is not found, add it to the end as a fallback
					acc.push(designLine)
				}
			}
			return acc
		},
		[],
	)

	const designCount = designLines.length
	return (
		<Panel>
			<PanelHeader>
				<PanelTitle>Line</PanelTitle>
				<div className="flex flex-shrink">
					<PanelFormArtboardDesignNewLine artboardId={artboard.id} />
				</div>
			</PanelHeader>
			{orderedDesignLines.map((designLine, index) => {
				const { id, visible, line } = designLine
				return (
					<PanelRow key={line.id}>
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
								<PanelPopoverArtboardDesignLine
									artboardId={artboard.id}
									line={line}
								/>
								<PanelFormArtboardDesignEditLine
									artboardId={artboard.id}
									line={line}
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
								/>
							</PanelRowIconContainer>
						</PanelRowContainer>
					</PanelRow>
				)
			})}
		</Panel>
	)
}
