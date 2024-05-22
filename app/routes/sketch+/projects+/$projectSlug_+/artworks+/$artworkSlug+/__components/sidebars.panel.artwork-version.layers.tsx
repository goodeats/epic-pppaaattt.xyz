import { DashboardEntityPanel } from '#app/components/templates/panel/dashboard-entity-panel'
import { type IArtworkVersionWithDesignsAndLayers } from '#app/models/artwork-version/artwork-version.server'
import { type ILayerWithDesigns } from '#app/models/layer/layer.server'
import { DashboardPanelCreateArtworkVersionLayerStrategy } from '#app/strategies/component/dashboard-panel/create-entity.strategy'
import { DashboardPanelArtworkVersionLayerActionStrategy } from '#app/strategies/component/dashboard-panel/entity-action/entity-action'
import { DashboardPanelUpdateArtworkVersionLayerTypeOrderStrategy } from '#app/strategies/component/dashboard-panel/update-entity-order.strategy'
import { orderLinkedItems } from '#app/utils/linked-list.utils'

export const PanelArtworkVersionLayers = ({
	version,
}: {
	version: IArtworkVersionWithDesignsAndLayers
}) => {
	const orderedLayers = orderLinkedItems<ILayerWithDesigns>(version.layers)

	const strategyEntityNew =
		new DashboardPanelCreateArtworkVersionLayerStrategy()
	const strategyReorder =
		new DashboardPanelUpdateArtworkVersionLayerTypeOrderStrategy()
	const strategyActions = new DashboardPanelArtworkVersionLayerActionStrategy()

	return (
		<div>
			<DashboardEntityPanel
				type="layer"
				parent={version}
				entities={orderedLayers}
				strategyEntityNew={strategyEntityNew}
				strategyReorder={strategyReorder}
				strategyActions={strategyActions}
			/>
		</div>
	)
}
