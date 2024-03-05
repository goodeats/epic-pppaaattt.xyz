import {
	type IDesignWithType,
	type IDesignWithPalette,
	type IDesignWithSize,
	type IDesignWithFill,
} from '#app/models/design.server'
import { type IFill } from '#app/models/fill.server'
import { type IPalette } from '#app/models/palette.server'
import { type ISize } from '#app/models/size.server'
import { type PickedArtboardType } from '../queries'
import { PanelContentArtboardBackgroundColor } from './panel-content-artboard-background-color'
import { PanelContentArtboardDesignFill } from './panel-content-artboard-design-fill'
import { PanelContentArtboardDesignPalette } from './panel-content-artboard-design-palette'
import { PanelContentArtboardDesignSize } from './panel-content-artboard-design-size'
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
		</div>
	)
}
