import { type IArtworkVersionWithChildren } from '#app/models/artwork-version/artwork-version.server'
import { DashboardPanelCreateArtworkVersionDesignTypeStrategy } from '#app/strategies/component/dashboard-panel/create-entity.strategy'
import { DashboardPanelArtworkVersionDesignActionStrategy } from '#app/strategies/component/dashboard-panel/entity-action/entity-action'
import { DashboardPanelUpdateArtworkVersionDesignTypeOrderStrategy } from '#app/strategies/component/dashboard-panel/update-entity-order.strategy'
import { PanelAssets } from './sidebars.panel.assets'

export const PanelArtworkVersionAssets = ({
	version,
}: {
	version: IArtworkVersionWithChildren
}) => {
	const strategyEntityNew =
		new DashboardPanelCreateArtworkVersionDesignTypeStrategy()
	const strategyReorder =
		new DashboardPanelUpdateArtworkVersionDesignTypeOrderStrategy()
	const strategyActions = new DashboardPanelArtworkVersionDesignActionStrategy()

	return (
		<PanelAssets
			parent={version}
			strategyEntityNew={strategyEntityNew}
			strategyReorder={strategyReorder}
			strategyActions={strategyActions}
		/>
	)
}
