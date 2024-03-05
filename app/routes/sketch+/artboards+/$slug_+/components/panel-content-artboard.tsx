import {
	type IDesignWithType,
	type IDesignWithPalette,
	type IDesignWithSize,
	type IDesignWithFill,
	type IDesignWithStroke,
	type IDesignWithLine,
} from '#app/models/design.server'
import { type IFill } from '#app/models/fill.server'
import { type ILine } from '#app/models/line.server'
import { type IPalette } from '#app/models/palette.server'
import { type ISize } from '#app/models/size.server'
import { type IStroke } from '#app/models/stroke.server'
import { type PickedArtboardType } from '../queries'
import { PanelContentArtboardBackgroundColor } from './panel-content-artboard-background-color'
import { PanelContentArtboardDesignFill } from './panel-content-artboard-design-fill'
import { PanelContentArtboardDesignLine } from './panel-content-artboard-design-line'
import { PanelContentArtboardDesignPalette } from './panel-content-artboard-design-palette'
import { PanelContentArtboardDesignSize } from './panel-content-artboard-design-size'
import { PanelContentArtboardDesignStroke } from './panel-content-artboard-design-stroke'
import { PanelContentArtboardFrame } from './panel-content-artboard-frame'

export const PanelContentArtboard = ({
	artboard,
	artboardDesigns,
}: {
	artboard: PickedArtboardType
	artboardDesigns: IDesignWithType[]
}) => {
	const designPalettes: IDesignWithPalette[] = artboardDesigns
		.filter(design => design.type === 'palette' && design.palette !== null)
		.map(design => ({ ...design, palette: design.palette as IPalette }))

	const designSizes: IDesignWithSize[] = artboardDesigns
		.filter(design => design.type === 'size' && design.size !== null)
		.map(design => ({ ...design, size: design.size as ISize }))

	const designFills: IDesignWithFill[] = artboardDesigns
		.filter(design => design.type === 'fill' && design.fill !== null)
		.map(design => ({ ...design, fill: design.fill as IFill }))

	const designStrokes: IDesignWithStroke[] = artboardDesigns
		.filter(design => design.type === 'stroke' && design.stroke !== null)
		.map(design => ({ ...design, stroke: design.stroke as IStroke }))

	const designLines: IDesignWithLine[] = artboardDesigns
		.filter(design => design.type === 'line' && design.line !== null)
		.map(design => ({ ...design, line: design.line as ILine }))

	return (
		<div>
			<PanelContentArtboardFrame artboard={artboard} />
			<PanelContentArtboardBackgroundColor artboard={artboard} />
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
		</div>
	)
}
