import { type IArtworkVersionWithChildren } from '#app/models/artwork-version/artwork-version.server'
import { DashboardPanelCreateArtworkVersionAssetTypeStrategy } from '#app/strategies/component/dashboard-panel/create-entity.strategy'
import { DashboardPanelArtworkVersionAssetActionStrategy } from '#app/strategies/component/dashboard-panel/entity-action/entity-action'
import { DashboardPanelUpdateArtworkVersionAssetTypeOrderStrategy } from '#app/strategies/component/dashboard-panel/update-entity-order.strategy'
import { PanelAssets } from './sidebars.panel.assets'

export const PanelArtworkVersionAssets = ({
	version,
}: {
	version: IArtworkVersionWithChildren
}) => {
	const strategyEntityNew =
		new DashboardPanelCreateArtworkVersionAssetTypeStrategy()
	const strategyReorder =
		new DashboardPanelUpdateArtworkVersionAssetTypeOrderStrategy()
	const strategyActions = new DashboardPanelArtworkVersionAssetActionStrategy()

	return (
		<PanelAssets
			parent={version}
			strategyEntityNew={strategyEntityNew}
			strategyReorder={strategyReorder}
			strategyActions={strategyActions}
		/>
	)
}
