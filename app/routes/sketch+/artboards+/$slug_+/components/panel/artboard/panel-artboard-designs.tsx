import { type IArtboard } from '#app/models/artboard/artboard.server'
import { type IDesignsByType } from '#app/models/design.server'
import { designsByTypeToPanelArray } from '#app/utils/design'
import { PanelDesignType } from '../design/type/panel-design-type'
import { PanelArtboardBackground } from './panel-artboard-background'
import { PanelArtboardFrame } from './panel-artboard-frame'

export const PanelArtboardDesigns = ({
	artboard,
	designs,
}: {
	artboard: IArtboard
	designs: IDesignsByType
}) => {
	const artboardId = artboard.id
	const designTypePanels = designsByTypeToPanelArray({ designs })

	return (
		<div>
			<PanelArtboardFrame artboard={artboard} />
			<PanelArtboardBackground artboard={artboard} />
			{designTypePanels.map(({ type, designs }) => (
				<PanelDesignType
					key={type}
					type={type}
					artboardId={artboardId}
					designs={designs}
				/>
			))}
		</div>
	)
}
