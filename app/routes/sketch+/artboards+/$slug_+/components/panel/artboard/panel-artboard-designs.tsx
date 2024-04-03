import { type IDesignsByType } from '#app/models/design.server'
import { designsByTypeToPanelArray } from '#app/utils/design'
import { type PickedArtboardType } from '../../../queries'
import { PanelArtboardDesignType } from './design/panel-artboard-design-type'
import { PanelArtboardBackground } from './panel-artboard-background'
import { PanelArtboardFrame } from './panel-artboard-frame'

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
			<PanelArtboardFrame artboard={artboard} />
			<PanelArtboardBackground artboard={artboard} />
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
