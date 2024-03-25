import { type IDesignWithType } from '#app/models/design.server'
import { filterAndOrderArtboardDesignsByType } from '#app/utils/design'
import { type PickedArtboardType } from '../queries'
import { PanelContentArtboardBackgroundColor } from './panel-content-artboard-background-color'
import { PanelContentArtboardDesignFill } from './panel-content-artboard-design-fill'
import { PanelContentArtboardDesignLayout } from './panel-content-artboard-design-layout'
import { PanelContentArtboardDesignLine } from './panel-content-artboard-design-line'
import { PanelContentArtboardDesignPalette } from './panel-content-artboard-design-palette'
import { PanelContentArtboardDesignRotate } from './panel-content-artboard-design-rotate'
import { PanelContentArtboardDesignSize } from './panel-content-artboard-design-size'
import { PanelContentArtboardDesignStroke } from './panel-content-artboard-design-stroke'
import { PanelContentArtboardDesignTemplate } from './panel-content-artboard-design-template'
import { PanelContentArtboardFrame } from './panel-content-artboard-frame'

export const PanelContentArtboardDesigns = ({
	artboard,
	artboardDesigns,
}: {
	artboard: PickedArtboardType
	artboardDesigns: IDesignWithType[]
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
	} = filterAndOrderArtboardDesignsByType({
		designs: artboardDesigns,
	})

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
