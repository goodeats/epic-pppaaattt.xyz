import { type PickedArtboardType } from '../queries'
import { PanelContentArtboardBackgroundColor } from './panel-content-artboard-background-color'
import { PanelContentArtboardDesignPalette } from './panel-content-artboard-design-palette'
import { PanelContentArtboardFrame } from './panel-content-artboard-frame'

export const PanelContentArtboard = ({
	artboard,
}: {
	artboard: PickedArtboardType
}) => {
	return (
		<div>
			<PanelContentArtboardFrame artboard={artboard} />
			<PanelContentArtboardBackgroundColor artboard={artboard} />
			<PanelContentArtboardDesignPalette artboard={artboard} />
		</div>
	)
}
