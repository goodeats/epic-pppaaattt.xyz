import {
	type IDesignWithType,
	type IDesignWithPalette,
} from '#app/models/design.server'
import { type IPalette } from '#app/models/palette.server'
import { type PickedArtboardType } from '../queries'
import { PanelContentArtboardBackgroundColor } from './panel-content-artboard-background-color'
import { PanelContentArtboardDesignPalette } from './panel-content-artboard-design-palette'
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

	return (
		<div>
			<PanelContentArtboardFrame artboard={artboard} />
			<PanelContentArtboardBackgroundColor artboard={artboard} />
			<PanelContentArtboardDesignPalette
				artboard={artboard}
				designPalettes={designPalettes}
			/>
		</div>
	)
}
