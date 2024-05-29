import { type IArtworkVersionWithDesignsAndLayers } from '#app/models/artwork-version/artwork-version.server'
import { DashboardPanelCreateArtworkVersionDesignTypeStrategy } from '#app/strategies/component/dashboard-panel/create-entity.strategy'
import { DashboardPanelArtworkVersionDesignActionStrategy } from '#app/strategies/component/dashboard-panel/entity-action/entity-action'
import { DashboardPanelUpdateArtworkVersionDesignTypeOrderStrategy } from '#app/strategies/component/dashboard-panel/update-entity-order.strategy'
import { PanelDesigns } from './sidebars.panel.designs'

export const PanelArtworkVersionDesigns = ({
	version,
}: {
	version: IArtworkVersionWithDesignsAndLayers
}) => {
	const strategyEntityNew =
		new DashboardPanelCreateArtworkVersionDesignTypeStrategy()
	const strategyReorder =
		new DashboardPanelUpdateArtworkVersionDesignTypeOrderStrategy()
	const strategyActions =
		new DashboardPanelArtworkVersionDesignActionStrategy()

	return (
		<PanelDesigns
			parent={version}
			strategyEntityNew={strategyEntityNew}
			strategyReorder={strategyReorder}
			strategyActions={strategyActions}
		/>
	)
}
