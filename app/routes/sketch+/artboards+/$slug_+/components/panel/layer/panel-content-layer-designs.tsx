import { type IDesignsByType } from '#app/models/design.server'
import { type ILayer } from '#app/models/layer.server'
import { PanelContentLayerDesignFill } from './design/panel-content-layer-design-fill'
import { PanelContentLayerDesignLayout } from './design/panel-content-layer-design-layout'
import { PanelContentLayerDesignLine } from './design/panel-content-layer-design-line'
import { PanelContentLayerDesignPalette } from './design/panel-content-layer-design-palette'
import { PanelContentLayerDesignRotate } from './design/panel-content-layer-design-rotate'
import { PanelContentLayerDesignSize } from './design/panel-content-layer-design-size'
import { PanelContentLayerDesignStroke } from './design/panel-content-layer-design-stroke'

export const PanelContentLayerDesigns = ({
	layer,
	designs,
}: {
	layer: ILayer
	designs: IDesignsByType
}) => {
	const {
		designPalettes,
		designSizes,
		designFills,
		designStrokes,
		designLines,
		designRotates,
		designLayouts,
		// designTemplates,
	} = designs

	return (
		<div>
			<PanelContentLayerDesignLayout
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
			{/* <PanelContentArtboardDesignTemplate
				artboard={artboard}
				designTemplates={designTemplates}
			/> */}
		</div>
	)
}
