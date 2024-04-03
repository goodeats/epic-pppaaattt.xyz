import { useSearchParams } from '@remix-run/react'
import {
	SidebarPanel,
	SidebarPanelRowActionsContainer,
	SidebarPanelHeader,
	SidebarPanelRow,
	SidebarPanelRowReorderContainer,
	SidebarPanelRowContainer,
	SidebarPanelRowValuesContainer,
} from '#app/components/templates'
import { Icon } from '#app/components/ui/icon'
import { type ILayer } from '#app/models/layer.server'
import { type PickedArtboardType } from '../../../queries'
import { PanelFormArtboardLayerNew } from '../../forms/artboard/layer/panel-form-artboard-layer-new'
import { PanelFormArtboardLayerReorder } from '../../forms/artboard/layer/panel-form-artboard-layer-reorder'
import { PanelFormArtboardLayerToggleVisible } from '../../forms/artboard/layer/panel-form-artboard-layer-toggle-visible'
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

	const layerCount = layers.length
	return (
		<SidebarPanel>
			<SidebarPanelHeader title="Layers">
				<SidebarPanelRowActionsContainer>
					<PanelFormArtboardLayerNew artboardId={artboard.id} />
				</SidebarPanelRowActionsContainer>
			</SidebarPanelHeader>
			{layers.map((layer, index) => {
				const { id, visible } = layer
				const isSearchedLayer = layerSearchParams === layer.id

				const PanelSelect = () => {
					return (
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
					)
				}

				return (
					<SidebarPanelRow
						key={layer.id}
						className={
							isSearchedLayer
								? 'bg-secondary'
								: 'hover:bg-secondary focus:bg-secondary'
						}
					>
						<SidebarPanelRowReorderContainer>
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
						</SidebarPanelRowReorderContainer>
						<SidebarPanelRowContainer>
							<SidebarPanelRowValuesContainer>
								<PanelPopoverLayer artboardId={artboard.id} layer={layer} />
								<PanelSelect />
							</SidebarPanelRowValuesContainer>
							<SidebarPanelRowActionsContainer>
								{isSearchedLayer && (
									<Icon name="check">
										<span className="sr-only">Selected</span>
									</Icon>
								)}
								<PanelFormArtboardLayerToggleVisible
									id={id}
									artboardId={artboard.id}
									visible={visible}
								/>
								{/* delete form is in popover */}
							</SidebarPanelRowActionsContainer>
						</SidebarPanelRowContainer>
					</SidebarPanelRow>
				)
			})}
		</SidebarPanel>
	)
}
