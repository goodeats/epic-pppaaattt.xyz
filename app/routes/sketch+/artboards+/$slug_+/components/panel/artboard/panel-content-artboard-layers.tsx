import { useSearchParams } from '@remix-run/react'
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
import { Icon } from '#app/components/ui/icon'
import { type ILayer } from '#app/models/layer.server'
import { type PickedArtboardType } from '../../../queries'
import { PanelFormArtboardLayerNew } from '../../forms/artboard/layer/panel-form-artboard-layer-new'
import { PanelFormArtboardLayerReorder } from '../../forms/artboard/layer/panel-form-artboard-layer-reorder'
import { PanelFormArtboardLayerToggleVisibility } from '../../forms/artboard/layer/panel-form-artboard-layer-toggle-visibility'
import { PanelPopoverLayer } from '../../popovers/layer/panel-popover-layer'

export const PanelContentArtboardLayers = ({
	artboard,
	layers,
}: {
	artboard: PickedArtboardType
	layers: ILayer[]
}) => {
	const [searchParams, setSearchParams] = useSearchParams()
	const layerSearchParams = searchParams.get('layerId')

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
				const isSearchedLayer = layerSearchParams === layer.id

				return (
					<PanelRow
						key={layer.id}
						className={
							isSearchedLayer
								? 'bg-secondary'
								: 'hover:bg-secondary focus:bg-secondary'
						}
					>
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
								<PanelPopoverLayer artboardId={artboard.id} layer={layer} />
								<div
									className="flex cursor-pointer"
									onClick={e => {
										const params = new URLSearchParams()
										isSearchedLayer
											? params.delete('layerId')
											: params.set('layerId', layer.id)
										setSearchParams(params, {
											preventScrollReset: true,
										})
									}}
								>
									{layer.name}
								</div>
							</PanelRowValueContainer>
							<PanelRowIconContainer>
								{isSearchedLayer && (
									<Icon name="check">
										<span className="sr-only">Selected</span>
									</Icon>
								)}
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
