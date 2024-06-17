import { type ILayerWithChildren } from '#app/models/layer/layer.server'
import { PanelLayerAssets } from './sidebars.panel.assets.layer'
import { PanelLayerDesigns } from './sidebars.panel.designs.layer'

export const PanelLayer = ({ layer }: { layer: ILayerWithChildren }) => {
	return (
		<div>
			<PanelLayerAssets layer={layer} />
			<PanelLayerDesigns layer={layer} />
		</div>
	)
}
