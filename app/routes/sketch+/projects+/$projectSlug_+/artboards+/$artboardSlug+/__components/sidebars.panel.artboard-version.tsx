import { DashboardEntityPanel } from '#app/components/templates/panel/dashboard-entity-panel'
import { type IArtboardVersionWithDesignsAndLayers } from '#app/models/artboard-version/artboard-version.server'
import { DesignParentTypeIdEnum } from '#app/schema/design'
import { DashboardPanelCreateArtboardVersionDesignTypeStrategy } from '#app/strategies/component/dashboard-panel/create-entity.strategy'
import {
	designsByTypeToPanelArray,
	filterAndOrderDesignsByType,
} from '#app/utils/design'
import { PanelArtboardVersionBackground } from './sidebars.panel.artboard-version._background'
import { PanelArtboardVersionFrame } from './sidebars.panel.artboard-version._frame'

export const PanelArtboardVersion = ({
	version,
}: {
	version: IArtboardVersionWithDesignsAndLayers
}) => {
	const orderedDesigns = filterAndOrderDesignsByType({
		designs: version.designs,
	})
	const designTypePanels = designsByTypeToPanelArray({
		designs: orderedDesigns,
	})
	// remove trim after testing actions work for one design type
	const designsTrimmed = [designTypePanels[0]]

	const strategyEntityNew =
		new DashboardPanelCreateArtboardVersionDesignTypeStrategy()

	return (
		<div>
			<PanelArtboardVersionFrame version={version} />
			<PanelArtboardVersionBackground version={version} />
			{/* {designTypePanels.map(({ type, designs }) => ( */}
			{designsTrimmed.map(({ type, designs }) => (
				// strategy functions:
				// - entities are designs
				// - new design
				// - delete design
				// - move up/down design
				// - toggle visible design
				<DashboardEntityPanel
					key={type}
					type={type}
					parentTypeId={DesignParentTypeIdEnum.ARTBOARD_VERSION_ID}
					parent={version}
					entities={designs}
					strategyEntityNew={strategyEntityNew}
				/>
			))}
		</div>
	)
}
