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
			{/* <PanelContentLayerDesignLayout
				layer={layer}
				designLayouts={designLayouts}
			/>
			<PanelContentLayerDesignPalette
				layer={layer}
				designPalettes={designPalettes}
			/>
			<PanelContentLayerDesignSize layer={layer} designSizes={designSizes} />
			<PanelContentLayerDesignFill layer={layer} designFills={designFills} />
			<PanelContentLayerDesignStroke
				layer={layer}
				designStrokes={designStrokes}
			/>
			<PanelContentLayerDesignLine layer={layer} designLines={designLines} />
			<PanelContentLayerDesignRotate
				layer={layer}
				designRotates={designRotates}
			/>
			<PanelContentLayerDesignTemplate
				layer={layer}
				designTemplates={designTemplates}
			/> */}
		</div>
	)
}
