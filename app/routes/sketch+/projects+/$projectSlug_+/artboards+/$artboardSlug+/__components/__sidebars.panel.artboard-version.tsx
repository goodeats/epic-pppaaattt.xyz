import { DashboardEntityPanel } from '#app/components/templates/panel/dashboard-entity-panel'
import { type IArtboardVersionWithDesignsAndLayers } from '#app/models/artboard-version/artboard-version.server'
import { DesignParentTypeEnum } from '#app/schema/design'
import { DashboardPanelCreateArtboardVersionDesignTypeStrategy } from '#app/strategies/component/dashboard-panel/create-entity.strategy'
import {
	designsByTypeToPanelArray,
	filterAndOrderDesignsByType,
} from '#app/utils/design'
import { PanelArtboardVersionBackground } from './__sidebars.panel.artboard-version._background'
import { PanelArtboardVersionFrame } from './__sidebars.panel.artboard-version._frame'

export const PanelArtboardVersion = ({
	version,
}: {
	version: IArtboardVersionWithDesignsAndLayers
}) => {
	const designTypePanels = designsByTypeToPanelArray({
		designs: filterAndOrderDesignsByType({ designs: version.designs }),
	})

	const strategyEntityNew =
		new DashboardPanelCreateArtboardVersionDesignTypeStrategy()

	return (
		<div>
			<PanelArtboardVersionFrame version={version} />
			<PanelArtboardVersionBackground version={version} />
			{designTypePanels.map(({ type, designs }) => (
				// strategy functions:
				// - entities are designs
				// - new design
				// - delete design
				// - move up/down design
				// - toggle visible design
				<DashboardEntityPanel
					key={type}
					type={type}
					parentType={DesignParentTypeEnum.ARTBOARD_VERSION}
					parent={version}
					entities={designs}
					strategyEntityNew={strategyEntityNew}
				/>
			))}
		</div>
	)
}
