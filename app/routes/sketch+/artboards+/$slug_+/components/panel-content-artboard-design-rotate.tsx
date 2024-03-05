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
import { type IDesignWithRotate } from '#app/models/design.server'
import { type PickedArtboardType } from '../queries'
import { PanelFormArtboardDesignDelete } from './panel-form-artboard-design-delete'
import { PanelFormArtboardDesignEditRotate } from './panel-form-artboard-design-edit-rotate'
import { PanelFormArtboardDesignNewRotate } from './panel-form-artboard-design-new-rotate'
import { PanelFormArtboardDesignReorder } from './panel-form-artboard-design-reorder'
import { PanelFormArtboardDesignToggleVisibility } from './panel-form-artboard-design-toggle-visibility'
import { PanelPopoverArtboardDesignRotate } from './panel-popover-artboard-design-rotate'

export const PanelContentArtboardDesignRotate = ({
	artboard,
	designRotates,
}: {
	artboard: PickedArtboardType
	designRotates: IDesignWithRotate[]
}) => {
	const orderedDesignRotates = designRotates.reduce(
		(acc: IDesignWithRotate[], designRotate) => {
			if (!designRotate.prevId) {
				acc.unshift(designRotate) // Add the head of the list to the start
			} else {
				let currentDesignIndex = acc.findIndex(
					d => d.id === designRotate.prevId,
				)
				if (currentDesignIndex !== -1) {
					// Insert the designRotate right after its predecessor
					acc.splice(currentDesignIndex + 1, 0, designRotate)
				} else {
					// If predecessor is not found, add it to the end as a fallback
					acc.push(designRotate)
				}
			}
			return acc
		},
		[],
	)

	const designCount = designRotates.length
	return (
		<Panel>
			<PanelHeader>
				<PanelTitle>Rotate</PanelTitle>
				<div className="flex flex-shrink">
					<PanelFormArtboardDesignNewRotate artboardId={artboard.id} />
				</div>
			</PanelHeader>
			{orderedDesignRotates.map((designRotate, index) => {
				const { id, visible, rotate } = designRotate
				return (
					<PanelRow key={rotate.id}>
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
								<PanelPopoverArtboardDesignRotate
									artboardId={artboard.id}
									rotate={rotate}
								/>
								{rotate.basis !== 'defined' ? (
									<Input
										type="text"
										className={'flex h-8'}
										disabled
										defaultValue={rotate.basis}
									/>
								) : (
									<PanelFormArtboardDesignEditRotate
										artboardId={artboard.id}
										rotate={rotate}
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
								/>
							</PanelRowIconContainer>
						</PanelRowContainer>
					</PanelRow>
				)
			})}
		</Panel>
	)
}
