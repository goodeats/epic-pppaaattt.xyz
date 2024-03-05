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
import { type IDesignWithFill } from '#app/models/design.server'
import { type PickedArtboardType } from '../queries'
import { PanelFormArtboardDesignDelete } from './panel-form-artboard-design-delete'
import { PanelFormArtboardDesignNewFill } from './panel-form-artboard-design-new-fill'
import { PanelFormArtboardDesignReorder } from './panel-form-artboard-design-reorder'
import { PanelFormArtboardDesignToggleVisibility } from './panel-form-artboard-design-toggle-visibility'

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
								{/* <PanelPopoverArtboardDesignSize fill={fill} /> */}
								{/* <PanelFormArtboardDesignEditSize
									artboardId={artboard.id}
									fill={fill}
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
