import { type IDesignsByType } from '#app/models/design.server'
import { type PickedArtboardType } from '../../../queries'
import { PanelContentArtboardDesignFill } from './design/panel-content-artboard-design-fill'
import { PanelContentArtboardDesignLayout } from './design/panel-content-artboard-design-layout'
import { PanelContentArtboardDesignLine } from './design/panel-content-artboard-design-line'
import { PanelContentArtboardDesignPalette } from './design/panel-content-artboard-design-palette'
import { PanelContentArtboardDesignRotate } from './design/panel-content-artboard-design-rotate'
import { PanelContentArtboardDesignSize } from './design/panel-content-artboard-design-size'
import { PanelContentArtboardDesignStroke } from './design/panel-content-artboard-design-stroke'
import { PanelContentArtboardDesignTemplate } from './design/panel-content-artboard-design-template'
import { PanelContentArtboardBackgroundColor } from './panel-content-artboard-background-color'
import { PanelContentArtboardFrame } from './panel-content-artboard-frame'

export const PanelContentArtboardDesigns = ({
	artboard,
	designs,
}: {
	artboard: PickedArtboardType
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
		designTemplates,
	} = designs

	return (
		<div>
			<PanelContentArtboardFrame artboard={artboard} />
			<PanelContentArtboardBackgroundColor artboard={artboard} />
			<PanelContentArtboardDesignLayout
				artboard={artboard}
				designLayouts={designLayouts}
			/>
			<PanelContentArtboardDesignPalette
				artboard={artboard}
				designPalettes={designPalettes}
			/>
			<PanelContentArtboardDesignSize
				artboard={artboard}
				designSizes={designSizes}
			/>
			<PanelContentArtboardDesignFill
				artboard={artboard}
				designFills={designFills}
			/>
			<PanelContentArtboardDesignStroke
				artboard={artboard}
				designStrokes={designStrokes}
			/>
			<PanelContentArtboardDesignLine
				artboard={artboard}
				designLines={designLines}
			/>
			<PanelContentArtboardDesignRotate
				artboard={artboard}
				designRotates={designRotates}
			/>
			<PanelContentArtboardDesignTemplate
				artboard={artboard}
				designTemplates={designTemplates}
			/>
		</div>
	)
}
