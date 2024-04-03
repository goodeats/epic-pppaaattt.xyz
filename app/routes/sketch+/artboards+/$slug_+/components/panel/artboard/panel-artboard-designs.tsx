import { type IDesignsByType } from '#app/models/design.server'
import { designsByTypeToPanelArray } from '#app/utils/design'
import { type PickedArtboardType } from '../../../queries'
import { PanelArtboardDesignType } from './design/panel-artboard-design-type'
import { PanelContentArtboardBackgroundColor } from './panel-content-artboard-background-color'
import { PanelContentArtboardFrame } from './panel-content-artboard-frame'

export const PanelArtboardDesigns = ({
	artboard,
	designs,
}: {
	artboard: PickedArtboardType
	designs: IDesignsByType
}) => {
	const artboardId = artboard.id
	const designTypePanels = designsByTypeToPanelArray({ designs })

	return (
		<div>
			<PanelContentArtboardFrame artboard={artboard} />
			<PanelContentArtboardBackgroundColor artboard={artboard} />
			{designTypePanels.map(({ type, designs }) => (
				<PanelArtboardDesignType
					key={type}
					type={type}
					artboardId={artboardId}
					designs={designs}
				/>
			))}
		</div>
	)
}
