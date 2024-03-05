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
import { type ILayer } from '#app/models/layer.server'
import { type PickedArtboardType } from '../queries'
import { PanelFormArtboardLayerNew } from './panel-form-artboard-design-new-layer'
import { PanelFormArtboardLayerEditName } from './panel-form-artboard-layer-edit-name'
import { PanelFormArtboardLayerReorder } from './panel-form-artboard-layer-reorder'
import { PanelFormArtboardLayerToggleVisibility } from './panel-form-artboard-layer-toggle-visibility'
import { PanelPopoverArtboardLayer } from './panel-popover-artboard-layer'

export const PanelContentArtboardLayer = ({
	artboard,
	layers,
}: {
	artboard: PickedArtboardType
	layers: ILayer[]
}) => {
	const orderedLayers = layers.reduce((acc: ILayer[], layer) => {
		if (!layer.prevId) {
			acc.unshift(layer) // Add the head of the list to the start
		} else {
			let currentDesignIndex = acc.findIndex(d => d.id === layer.prevId)
			if (currentDesignIndex !== -1) {
				// Insert the layer right after its predecessor
				acc.splice(currentDesignIndex + 1, 0, layer)
			} else {
				// If predecessor is not found, add it to the end as a fallback
				acc.push(layer)
			}
		}
		return acc
	}, [])

	const layerCount = layers.length
	return (
		<Panel>
			<PanelHeader>
				<PanelTitle>Layers</PanelTitle>
				<div className="flex flex-shrink">
					<PanelFormArtboardLayerNew artboardId={artboard.id} />
				</div>
			</PanelHeader>
			{orderedLayers.map((layer, index) => {
				const { id, visible } = layer
				return (
					<PanelRow key={layer.id}>
						<PanelRowOrderContainer>
							<PanelFormArtboardLayerReorder
								id={id}
								artboardId={artboard.id}
								panelCount={layerCount}
								panelIndex={index}
								direction="up"
							/>
							<PanelFormArtboardLayerReorder
								id={id}
								artboardId={artboard.id}
								panelCount={layerCount}
								panelIndex={index}
								direction="down"
							/>
						</PanelRowOrderContainer>
						<PanelRowContainer>
							<PanelRowValueContainer>
								<PanelPopoverArtboardLayer
									artboardId={artboard.id}
									layer={layer}
								/>
								<PanelFormArtboardLayerEditName
									artboardId={artboard.id}
									layer={layer}
								/>
							</PanelRowValueContainer>
							<PanelRowIconContainer>
								<PanelFormArtboardLayerToggleVisibility
									id={id}
									artboardId={artboard.id}
									visible={visible}
								/>
								{/* want to hide it from accidentally being clicked */}
								{/* so it is in the popover */}
								{/* <PanelFormArtboardLayerDelete
									id={id}
									artboardId={artboard.id}
								/> */}
							</PanelRowIconContainer>
						</PanelRowContainer>
					</PanelRow>
				)
			})}
		</Panel>
	)
}
