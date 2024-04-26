import { type IArtboardVersionWithDesignsAndLayers } from '#app/models/artboard-version/artboard-version.server'
import { DashboardPanelCreateArtboardVersionDesignTypeStrategy } from '#app/strategies/component/dashboard-panel/create-entity.strategy'
import { DashboardPanelArtboardVersionDesignActionStrategy } from '#app/strategies/component/dashboard-panel/entity-action/entity-action'
import { DashboardPanelUpdateArtboardVersionDesignTypeOrderStrategy } from '#app/strategies/component/dashboard-panel/update-entity-order.strategy'
import { PanelDesigns } from './sidebars.panel.designs'

export const PanelArtboardVersionDesigns = ({
	version,
}: {
	version: IArtboardVersionWithDesignsAndLayers
}) => {
	const strategyEntityNew =
		new DashboardPanelCreateArtboardVersionDesignTypeStrategy()
	const strategyReorder =
		new DashboardPanelUpdateArtboardVersionDesignTypeOrderStrategy()
	const strategyActions =
		new DashboardPanelArtboardVersionDesignActionStrategy()

	return (
		<PanelDesigns
			parent={version}
			strategyEntityNew={strategyEntityNew}
			strategyReorder={strategyReorder}
			strategyActions={strategyActions}
		/>
	)
}
