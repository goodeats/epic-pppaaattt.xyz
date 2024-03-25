import { type IDesignsByType } from '#app/models/design.server'
import { type ILayer } from '#app/models/layer.server'
import { PanelContentLayerDesignLayout } from './panel-content-layer-design-layout'

export const PanelContentLayerDesigns = ({
	layer,
	designs,
}: {
	layer: ILayer
	designs: IDesignsByType
}) => {
	const {
		// designPalettes,
		// designSizes,
		// designFills,
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
			{/* <PanelContentArtboardDesignPalette
				artboard={artboard}
				designPalettes={designPalettes}
			/> */}
			{/* <PanelContentArtboardDesignSize
				artboard={artboard}
				designSizes={designSizes}
			/> */}
			{/* <PanelContentArtboardDesignFill
				artboard={artboard}
				designFills={designFills}
			/> */}
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
