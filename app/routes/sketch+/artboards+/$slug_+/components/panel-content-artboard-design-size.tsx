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
import { DesignTypeEnum } from '#app/schema/design'
import { parseArtboardSelectedDesigns } from '#app/utils/artboard'
import {
	designsIdArray,
	filterVisibleDesigns,
	orderLinkedDesigns,
} from '#app/utils/design'
import { type PickedArtboardType } from '../queries'
import { PanelFormArtboardDesignDelete } from './panel-form-artboard-design-delete'
import { PanelFormArtboardDesignEditSize } from './panel-form-artboard-design-edit-size'
import { PanelFormArtboardDesignNew } from './panel-form-artboard-design-new'
import { PanelFormArtboardDesignReorder } from './panel-form-artboard-design-reorder'
import { PanelFormArtboardDesignToggleVisibility } from './panel-form-artboard-design-toggle-visibility'
import { PanelPopoverArtboardDesignSize } from './panel-popover-artboard-design-size'

export const PanelContentArtboardDesignSize = ({
	artboard,
	designSizes,
}: {
	artboard: PickedArtboardType
	designSizes: IDesignWithSize[]
}) => {
	const orderedDesigns = orderLinkedDesigns(designSizes) as IDesignWithSize[]

	// helps with finding first visible design on toggle visible
	// const orderedDesignIds = designsIdArray(orderedDesigns)

	// helps with disabling reorder buttons
	const designCount = designSizes.length

	// helps with resetting the selected design for artboard
	const visibleDesigns = filterVisibleDesigns(orderedDesigns)
	const visibleDesignIds = designsIdArray(visibleDesigns)

	// helps with knowing there is a visible design
	// const firstVisibleDesignId = visibleDesignIds[0]

	const selectedDesignId = parseArtboardSelectedDesigns({ artboard }).sizeId
	if (selectedDesignId) {
		const sd = orderedDesigns.find(design => design.id === selectedDesignId)
		console.log('selected: ', sd?.size?.value)
	}

	return (
		<Panel>
			<PanelHeader>
				<PanelTitle>Size</PanelTitle>
				<div className="flex flex-shrink">
					<PanelFormArtboardDesignNew
						artboardId={artboard.id}
						type={DesignTypeEnum.SIZE}
						visibleDesignsCount={visibleDesignIds.length}
					/>
				</div>
			</PanelHeader>
			{orderedDesigns.map((design, index) => {
				const { id, visible, size } = design
				return (
					<PanelRow key={size.id}>
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
								<PanelPopoverArtboardDesignSize size={size} />
								<PanelFormArtboardDesignEditSize
									artboardId={artboard.id}
									size={size}
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
