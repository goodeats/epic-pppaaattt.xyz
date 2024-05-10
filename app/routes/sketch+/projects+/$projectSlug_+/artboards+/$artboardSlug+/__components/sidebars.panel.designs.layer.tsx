import { type ILayerWithDesigns } from '#app/models/layer/layer.server'
import { DashboardPanelCreateLayerDesignTypeStrategy } from '#app/strategies/component/dashboard-panel/create-entity.strategy'
import { DashboardPanelLayerDesignActionStrategy } from '#app/strategies/component/dashboard-panel/entity-action/entity-action'
import { DashboardPanelUpdateLayerDesignTypeOrderStrategy } from '#app/strategies/component/dashboard-panel/update-entity-order.strategy'
import { PanelDesigns } from './sidebars.panel.designs'

export const PanelLayerDesigns = ({ layer }: { layer: ILayerWithDesigns }) => {
	const strategyEntityNew = new DashboardPanelCreateLayerDesignTypeStrategy()
	const strategyReorder = new DashboardPanelUpdateLayerDesignTypeOrderStrategy()
	const strategyActions = new DashboardPanelLayerDesignActionStrategy()

	return (
		<PanelDesigns
			parent={layer}
			strategyEntityNew={strategyEntityNew}
			strategyReorder={strategyReorder}
			strategyActions={strategyActions}
		/>
	)
}
