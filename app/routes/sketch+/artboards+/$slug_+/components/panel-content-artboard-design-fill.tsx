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
import { type IDesignWithFill } from '#app/models/design.server'
import { type PickedArtboardType } from '../queries'
import { PanelFormArtboardDesignDelete } from './panel-form-artboard-design-delete'
import { PanelFormArtboardDesignEditFill } from './panel-form-artboard-design-edit-fill'
import { PanelFormArtboardDesignNewFill } from './panel-form-artboard-design-new-fill'
import { PanelFormArtboardDesignReorder } from './panel-form-artboard-design-reorder'
import { PanelFormArtboardDesignToggleVisibility } from './panel-form-artboard-design-toggle-visibility'
import { PanelPopoverArtboardDesignFill } from './panel-popover-artboard-design-fill'

export const PanelContentArtboardDesignFill = ({
	artboard,
	designFills,
}: {
	artboard: PickedArtboardType
	designFills: IDesignWithFill[]
}) => {
	const orderedDesignFills = designFills.reduce(
		(acc: IDesignWithFill[], designFill) => {
			if (!designFill.prevId) {
				acc.unshift(designFill) // Add the head of the list to the start
			} else {
				let currentDesignIndex = acc.findIndex(d => d.id === designFill.prevId)
				if (currentDesignIndex !== -1) {
					// Insert the designFill right after its predecessor
					acc.splice(currentDesignIndex + 1, 0, designFill)
				} else {
					// If predecessor is not found, add it to the end as a fallback
					acc.push(designFill)
				}
			}
			return acc
		},
		[],
	)

	const designCount = designFills.length
	return (
		<Panel>
			<PanelHeader>
				<PanelTitle>Fill</PanelTitle>
				<div className="flex flex-shrink">
					<PanelFormArtboardDesignNewFill artboardId={artboard.id} />
				</div>
			</PanelHeader>
			{orderedDesignFills.map((designFill, index) => {
				const { id, visible, fill } = designFill
				return (
					<PanelRow key={fill.id}>
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
								<PanelPopoverArtboardDesignFill
									artboardId={artboard.id}
									fill={fill}
								/>
								{/* this is a little buggy, but I can manage for now */}
								{fill.style === 'none' ? (
									<Input
										type="text"
										className={'flex h-8'}
										disabled
										defaultValue="None"
									/>
								) : fill.basis !== 'defined' ? (
									<Input
										type="text"
										className={'flex h-8'}
										disabled
										defaultValue={fill.basis}
									/>
								) : (
									<PanelFormArtboardDesignEditFill
										artboardId={artboard.id}
										fill={fill}
									/>
								)}
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
