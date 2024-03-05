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
import { PanelFormArtboardDesignDelete } from './panel-form-artboard-design-delete'
import { PanelFormArtboardLayerNew } from './panel-form-artboard-design-new-layer'
import { PanelFormArtboardDesignReorder } from './panel-form-artboard-design-reorder'
import { PanelFormArtboardLayerEditName } from './panel-form-artboard-layer-edit-name'
import { PanelFormArtboardLayerToggleVisibility } from './panel-form-artboard-layer-toggle-visibility'
import { PanelPopoverArtboardLayer } from './panel-popover-artboard-layer'

export const PanelContentArtboardLayer = ({
	artboard,
	layers,
}: {
	artboard: PickedArtboardType
	layers: ILayer[]
}) => {
	const layerCount = layers.length
	return (
		<Panel>
			<PanelHeader>
				<PanelTitle>Layers</PanelTitle>
				<div className="flex flex-shrink">
					<PanelFormArtboardLayerNew artboardId={artboard.id} />
				</div>
			</PanelHeader>
			{layers.map((layer, index) => {
				const { id, visible } = layer
				return (
					<PanelRow key={layer.id}>
						<PanelRowOrderContainer>
							<PanelFormArtboardDesignReorder
								id={id}
								artboardId={artboard.id}
								panelCount={layerCount}
								panelIndex={index}
								direction="up"
							/>
							<PanelFormArtboardDesignReorder
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
