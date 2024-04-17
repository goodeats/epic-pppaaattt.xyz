import { type IArtboardVersionWithDesignsAndLayers } from '#app/models/artboard-version/artboard-version.server'
import { PanelArtboardVersionBackground } from './__sidebars.panel.artboard-version._background'
import { PanelArtboardVersionFrame } from './__sidebars.panel.artboard-version._frame'

export const PanelArtboardVersion = ({
	version,
}: {
	version: IArtboardVersionWithDesignsAndLayers
}) => {
	// const versionId = version.id
	// const designTypePanels = designsByTypeToPanelArray({ designs: version.designs })

	return (
		<div>
			<PanelArtboardVersionFrame version={version} />
			<PanelArtboardVersionBackground version={version} />
			{/* {designTypePanels.map(({ type, designs }) => (
				<PanelDesignType
					key={type}
					type={type}
					versionId={versionId}
					designs={designs}
				/>
			))} */}
		</div>
	)
}
