import { type IArtworkVersionWithChildren } from '#app/models/artwork-version/artwork-version.server'
import { PanelArtworkVersionBackground } from './sidebars.panel.artwork-version.background'
import { PanelArtworkVersionFrame } from './sidebars.panel.artwork-version.frame'
import { PanelArtworkVersionWatermark } from './sidebars.panel.artwork-version.watermark'
import { PanelArtworkVersionAssets } from './sidebars.panel.assets.artwork-version'
import { PanelArtworkVersionDesigns } from './sidebars.panel.designs.artwork-version'

export const PanelArtworkVersion = ({
	version,
}: {
	version: IArtworkVersionWithChildren
}) => {
	return (
		<div>
			<PanelArtworkVersionFrame version={version} />
			<PanelArtworkVersionBackground version={version} />
			<PanelArtworkVersionWatermark version={version} />
			<PanelArtworkVersionDesigns version={version} />
			<PanelArtworkVersionAssets version={version} />
		</div>
	)
}
