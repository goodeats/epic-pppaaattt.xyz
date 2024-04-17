import { type IArtboardVersionWithDesignsAndLayers } from '#app/models/artboard-version/artboard-version.server'
import { PanelBackground } from './__background'
import { PanelFrame } from './__frame'

export const PanelArtboardVersionDesigns = ({
	version,
}: {
	version: IArtboardVersionWithDesignsAndLayers
}) => {
	// const versionId = version.id
	// const designTypePanels = designsByTypeToPanelArray({ designs: version.designs })

	return (
		<div>
			<PanelFrame version={version} />
			<PanelBackground version={version} />
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
