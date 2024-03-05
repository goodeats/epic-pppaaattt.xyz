import {
	type IDesignWithType,
	type IDesignWithPalette,
	type IDesignWithSize,
} from '#app/models/design.server'
import { type IPalette } from '#app/models/palette.server'
import { type ISize } from '#app/models/size.server'
import { type PickedArtboardType } from '../queries'
import { PanelContentArtboardBackgroundColor } from './panel-content-artboard-background-color'
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
		</div>
	)
}
