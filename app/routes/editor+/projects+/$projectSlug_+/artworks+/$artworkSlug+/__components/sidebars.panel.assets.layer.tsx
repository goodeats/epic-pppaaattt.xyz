import { type ILayerWithChildren } from '#app/models/layer/layer.server'
import { DashboardPanelCreateLayerAssetTypeStrategy } from '#app/strategies/component/dashboard-panel/create-entity.strategy'
import { DashboardPanelLayerAssetActionStrategy } from '#app/strategies/component/dashboard-panel/entity-action/entity-action'
import { DashboardPanelUpdateLayerAssetTypeOrderStrategy } from '#app/strategies/component/dashboard-panel/update-entity-order.strategy'
import { PanelAssets } from './sidebars.panel.assets'

export const PanelLayerAssets = ({ layer }: { layer: ILayerWithChildren }) => {
	const strategyEntityNew = new DashboardPanelCreateLayerAssetTypeStrategy()
	const strategyReorder = new DashboardPanelUpdateLayerAssetTypeOrderStrategy()
	const strategyActions = new DashboardPanelLayerAssetActionStrategy()

	return (
		<PanelAssets
			parent={layer}
			strategyEntityNew={strategyEntityNew}
			strategyReorder={strategyReorder}
			strategyActions={strategyActions}
		/>
	)
}
