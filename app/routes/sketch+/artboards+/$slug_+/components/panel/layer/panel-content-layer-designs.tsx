import { type IDesignsByType } from '#app/models/design.server'
import { type ILayer } from '#app/models/layer.server'
import { PanelContentLayerDesignFill } from './design/panel-content-layer-design-fill'
import { PanelContentLayerDesignLayout } from './design/panel-content-layer-design-layout'
import { PanelContentLayerDesignPalette } from './design/panel-content-layer-design-palette'
import { PanelContentLayerDesignSize } from './design/panel-content-layer-design-size'

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
		// designStrokes,
		// designLines,
		// designRotates,
		designLayouts,
		// designTemplates,
	} = designs

	return (
		<div>
			<p>layer panel</p>
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
			{/* <PanelContentArtboardDesignStroke
				artboard={artboard}
				designStrokes={designStrokes}
			/> */}
			{/* <PanelContentArtboardDesignLine
				artboard={artboard}
				designLines={designLines}
			/> */}
			{/* <PanelContentArtboardDesignRotate
				artboard={artboard}
				designRotates={designRotates}
			/> */}
			{/* <PanelContentArtboardDesignTemplate
				artboard={artboard}
				designTemplates={designTemplates}
			/> */}
		</div>
	)
}
