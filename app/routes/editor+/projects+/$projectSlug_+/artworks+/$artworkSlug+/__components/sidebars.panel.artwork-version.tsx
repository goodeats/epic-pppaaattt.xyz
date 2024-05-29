import { type IArtworkVersionWithDesignsAndLayers } from '#app/models/artwork-version/artwork-version.server'
import { PanelArtworkVersionBackground } from './sidebars.panel.artwork-version.background'
import { PanelArtworkVersionFrame } from './sidebars.panel.artwork-version.frame'
import { PanelArtworkVersionDesigns } from './sidebars.panel.designs.artwork-version'

export const PanelArtworkVersion = ({
	version,
}: {
	version: IArtworkVersionWithDesignsAndLayers
}) => {
	return (
		<div>
			<PanelArtworkVersionFrame version={version} />
			<PanelArtworkVersionBackground version={version} />
			<PanelArtworkVersionDesigns version={version} />
		</div>
	)
}
