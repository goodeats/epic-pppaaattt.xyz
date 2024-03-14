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
import { orderDesigns } from '#app/utils/design'
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
	const orderedDesignLines = orderDesigns(designLines) as IDesignWithLine[]

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
									updateSelectedDesignId={null}
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
