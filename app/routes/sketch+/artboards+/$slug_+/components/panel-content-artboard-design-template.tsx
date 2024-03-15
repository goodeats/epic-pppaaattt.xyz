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
import { type IDesignWithTemplate } from '#app/models/design.server'
import { type PickedArtboardType } from '../queries'
import { PanelFormArtboardDesignDelete } from './panel-form-artboard-design-delete'
import { PanelFormArtboardDesignNewTemplate } from './panel-form-artboard-design-new-template'
import { PanelFormArtboardDesignReorder } from './panel-form-artboard-design-reorder'
import { PanelFormArtboardDesignToggleVisibility } from './panel-form-artboard-design-toggle-visibility'
import { PanelPopoverArtboardDesignTemplate } from './panel-popover-artboard-design-template'

export const PanelContentArtboardDesignTemplate = ({
	artboard,
	designTemplates,
}: {
	artboard: PickedArtboardType
	designTemplates: IDesignWithTemplate[]
}) => {
	const orderedDesignTemplates = designTemplates.reduce(
		(acc: IDesignWithTemplate[], designTemplate) => {
			if (!designTemplate.prevId) {
				acc.unshift(designTemplate) // Add the head of the list to the start
			} else {
				let currentDesignIndex = acc.findIndex(
					d => d.id === designTemplate.prevId,
				)
				if (currentDesignIndex !== -1) {
					// Insert the designTemplate right after its predecessor
					acc.splice(currentDesignIndex + 1, 0, designTemplate)
				} else {
					// If predecessor is not found, add it to the end as a fallback
					acc.push(designTemplate)
				}
			}
			return acc
		},
		[],
	)

	const designCount = designTemplates.length
	return (
		<Panel>
			<PanelHeader>
				<PanelTitle>Template</PanelTitle>
				<div className="flex flex-shrink">
					<PanelFormArtboardDesignNewTemplate artboardId={artboard.id} />
				</div>
			</PanelHeader>
			{orderedDesignTemplates.map((designTemplate, index) => {
				const { id, visible, template } = designTemplate
				return (
					<PanelRow key={template.id}>
						<PanelRowOrderContainer>
							<PanelFormArtboardDesignReorder
								id={id}
								artboardId={artboard.id}
								panelCount={designCount}
								panelIndex={index}
								direction="up"
								updateSelectedDesignId={null}
							/>
							<PanelFormArtboardDesignReorder
								id={id}
								artboardId={artboard.id}
								panelCount={designCount}
								panelIndex={index}
								direction="down"
								updateSelectedDesignId={null}
							/>
						</PanelRowOrderContainer>
						<PanelRowContainer>
							<PanelRowValueContainer>
								<PanelPopoverArtboardDesignTemplate
									artboardId={artboard.id}
									template={template}
								/>
								<Input
									type="text"
									className={'flex h-8'}
									disabled
									defaultValue={template.style}
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
