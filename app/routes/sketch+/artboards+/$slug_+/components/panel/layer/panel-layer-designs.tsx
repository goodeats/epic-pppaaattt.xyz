import { type IDesignsByType } from '#app/models/design.server'
import { type ILayer } from '#app/models/layer.server'
import { designsByTypeToPanelArray } from '#app/utils/design'
import { PanelLayerDesignType } from './design/panel-layer-design-type'

export const PanelLayerDesigns = ({
	layer,
	designs,
}: {
	layer: ILayer
	designs: IDesignsByType
}) => {
	const layerId = layer.id
	const designTypePanels = designsByTypeToPanelArray({ designs })

	return (
		<div>
			{designTypePanels.map(({ type, designs }) => (
				<PanelLayerDesignType
					key={type}
					type={type}
					layerId={layerId}
					designs={designs}
				/>
			))}
		</div>
	)
}
