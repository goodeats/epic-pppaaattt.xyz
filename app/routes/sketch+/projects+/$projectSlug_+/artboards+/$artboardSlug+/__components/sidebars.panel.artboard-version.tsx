import { type IArtboardVersionWithDesignsAndLayers } from '#app/models/artboard-version/artboard-version.server'
import { PanelArtboardVersionBackground } from './sidebars.panel.artboard-version.background'
import { PanelArtboardVersionFrame } from './sidebars.panel.artboard-version.frame'
import { PanelArtboardVersionDesigns } from './sidebars.panel.designs.artboard-version'

export const PanelArtboardVersion = ({
	version,
}: {
	version: IArtboardVersionWithDesignsAndLayers
}) => {
	return (
		<div>
			<PanelArtboardVersionFrame version={version} />
			<PanelArtboardVersionBackground version={version} />
			<PanelArtboardVersionDesigns version={version} />
		</div>
	)
}
