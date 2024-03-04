import { type IPalette, type IDesignWithType } from '#app/models/design.server'
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
	const palettes: IPalette[] = artboardDesigns
		.filter(design => design.type === 'palette' && design.palette !== null)
		.map(design => design.palette as IPalette)

	return (
		<div>
			<PanelContentArtboardFrame artboard={artboard} />
			<PanelContentArtboardBackgroundColor artboard={artboard} />
			<PanelContentArtboardDesignPalette
				artboard={artboard}
				palettes={palettes}
			/>
		</div>
	)
}
