import { type ILayerWithDesigns } from '#app/models/layer/layer.server'
import { PanelLayerDesigns } from './sidebars.panel.designs.layer'

export const PanelLayer = ({ layer }: { layer: ILayerWithDesigns }) => {
	return (
		<div>
			<PanelLayerDesigns layer={layer} />
		</div>
	)
}
