import {
	type IDesignWithType,
	type IDesignWithPalette,
	type IDesignWithSize,
	type IDesignWithFill,
	type IDesignWithStroke,
	type IDesignWithLine,
	type IDesignWithRotate,
	type IDesignWithLayout,
	type IDesignWithTemplate,
} from '#app/models/design.server'
import { filterDesignsByType } from '#app/utils/design'
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

export const PanelContentArtboard = ({
	artboard,
	artboardDesigns,
}: {
	artboard: PickedArtboardType
	artboardDesigns: IDesignWithType[]
}) => {
	const designPalettes = filterDesignsByType(
		artboardDesigns,
		'palette',
	) as IDesignWithPalette[]
	const designSizes = filterDesignsByType(
		artboardDesigns,
		'size',
	) as IDesignWithSize[]
	const designFills = filterDesignsByType(
		artboardDesigns,
		'fill',
	) as IDesignWithFill[]
	const designStrokes = filterDesignsByType(
		artboardDesigns,
		'stroke',
	) as IDesignWithStroke[]
	const designLines = filterDesignsByType(
		artboardDesigns,
		'line',
	) as IDesignWithLine[]
	const designRotates = filterDesignsByType(
		artboardDesigns,
		'rotate',
	) as IDesignWithRotate[]
	const designLayouts = filterDesignsByType(
		artboardDesigns,
		'layout',
	) as IDesignWithLayout[]
	const designTemplates = filterDesignsByType(
		artboardDesigns,
		'template',
	) as IDesignWithTemplate[]

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
