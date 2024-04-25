import { DashboardEntityPanel } from '#app/components/templates/panel/dashboard-entity-panel'
import { type IArtboardVersionWithDesignsAndLayers } from '#app/models/artboard-version/artboard-version.server'
import { type ILayerWithDesigns } from '#app/models/layer.server'
import { DesignParentTypeIdEnum } from '#app/schema/design'
import { DashboardPanelCreateArtboardVersionLayerStrategy } from '#app/strategies/component/dashboard-panel/create-entity.strategy'
import { DashboardPanelArtboardVersionLayerActionStrategy } from '#app/strategies/component/dashboard-panel/entity-action/entity-action'
import { DashboardPanelUpdateLayerValuesStrategy } from '#app/strategies/component/dashboard-panel/update-entity/update-entity-values.layer'
import { DashboardPanelUpdateArtboardVersionLayerTypeOrderStrategy } from '#app/strategies/component/dashboard-panel/update-entity-order.strategy'
import { orderLinkedItems } from '#app/utils/linked-list.utils'

export const PanelArtboardVersionLayers = ({
	version,
}: {
	version: IArtboardVersionWithDesignsAndLayers
}) => {
	const orderedLayers = orderLinkedItems<ILayerWithDesigns>(version.layers)

	const strategyEntityNew =
		new DashboardPanelCreateArtboardVersionLayerStrategy()
	const strategyReorder =
		new DashboardPanelUpdateArtboardVersionLayerTypeOrderStrategy()
	const strategyEntityValues = new DashboardPanelUpdateLayerValuesStrategy()
	const strategyActions = new DashboardPanelArtboardVersionLayerActionStrategy()

	return (
		<div>
			<DashboardEntityPanel
				type="layer"
				parentTypeId={DesignParentTypeIdEnum.ARTBOARD_VERSION_ID}
				parent={version}
				entities={orderedLayers}
				strategyEntityNew={strategyEntityNew}
				strategyReorder={strategyReorder}
				strategyEntityValues={strategyEntityValues}
				strategyActions={strategyActions}
			/>
		</div>
	)
}
