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
import { type IDesignWithLayout } from '#app/models/design.server'
import { type PickedArtboardType } from '../queries'
import { PanelFormArtboardDesignDelete } from './panel-form-artboard-design-delete'
import { PanelFormArtboardDesignEditLayoutCount } from './panel-form-artboard-design-edit-layout-count'
import { PanelFormArtboardDesignNewLayout } from './panel-form-artboard-design-new-layout'
import { PanelFormArtboardDesignReorder } from './panel-form-artboard-design-reorder'
import { PanelFormArtboardDesignToggleVisibility } from './panel-form-artboard-design-toggle-visibility'
import { PanelPopoverArtboardDesignLayout } from './panel-popover-artboard-design-layout'

export const PanelContentArtboardDesignLayout = ({
	artboard,
	designLayouts,
}: {
	artboard: PickedArtboardType
	designLayouts: IDesignWithLayout[]
}) => {
	const orderedDesignLayouts = designLayouts.reduce(
		(acc: IDesignWithLayout[], designLayout) => {
			if (!designLayout.prevId) {
				acc.unshift(designLayout) // Add the head of the list to the start
			} else {
				let currentDesignIndex = acc.findIndex(
					d => d.id === designLayout.prevId,
				)
				if (currentDesignIndex !== -1) {
					// Insert the designLayout right after its predecessor
					acc.splice(currentDesignIndex + 1, 0, designLayout)
				} else {
					// If predecessor is not found, add it to the end as a fallback
					acc.push(designLayout)
				}
			}
			return acc
		},
		[],
	)

	const designCount = designLayouts.length
	return (
		<Panel>
			<PanelHeader>
				<PanelTitle>Layout</PanelTitle>
				<div className="flex flex-shrink">
					<PanelFormArtboardDesignNewLayout artboardId={artboard.id} />
				</div>
			</PanelHeader>
			{orderedDesignLayouts.map((designLayout, index) => {
				const { id, visible, layout } = designLayout
				return (
					<PanelRow key={layout.id}>
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
								<PanelPopoverArtboardDesignLayout
									artboardId={artboard.id}
									layout={layout}
								/>
								{layout.style === 'random' ? (
									<PanelFormArtboardDesignEditLayoutCount
										artboardId={artboard.id}
										layout={layout}
									/>
								) : (
									<Input
										type="text"
										className={'flex h-8'}
										disabled
										defaultValue="Grid"
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
