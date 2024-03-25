import { type IDesignsByType } from '#app/models/design.server'
import { type ILayer } from '#app/models/layer.server'

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
		// designLayouts,
		// designTemplates,
	} = designs

	return (
		<div>
			<p>layer panel</p>
			{/* <PanelContentArtboardDesignLayout
				artboard={artboard}
				designLayouts={designLayouts}
			/> */}
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
