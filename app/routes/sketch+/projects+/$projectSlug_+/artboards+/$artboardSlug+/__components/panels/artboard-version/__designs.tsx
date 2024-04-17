import { type IArtboardVersionWithDesignsAndLayers } from '#app/models/artboard-version/artboard-version.server'
import { PanelArtboardVersionWidth } from '#app/routes/resources+/panel.artboard-version.width'

export const PanelArtboardVersionDesigns = ({
	version,
}: {
	version: IArtboardVersionWithDesignsAndLayers
}) => {
	// const versionId = version.id
	// const designTypePanels = designsByTypeToPanelArray({ designs: version.designs })

	return (
		<div>
			<PanelArtboardVersionWidth version={version} />
			{/* <PanelArtboardFrame version={version} /> */}
			{/* <PanelBackground version={version} /> */}
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
