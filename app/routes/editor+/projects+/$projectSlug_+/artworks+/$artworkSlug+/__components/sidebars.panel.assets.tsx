import { DashboardEntityPanel } from '#app/components/templates/panel/dashboard-entity-panel'
import {
	type IAssetParent,
	type IAssetsByTypeWithType,
} from '#app/models/asset/asset.server'
import {
	assetsByTypeToPanelArray,
	groupAssetsByType,
} from '#app/models/asset/utils'
import { type IDashboardPanelCreateEntityStrategy } from '#app/strategies/component/dashboard-panel/create-entity.strategy'
import { type IDashboardPanelEntityActionStrategy } from '#app/strategies/component/dashboard-panel/entity-action/entity-action'
import { type IDashboardPanelUpdateEntityOrderStrategy } from '#app/strategies/component/dashboard-panel/update-entity-order.strategy'

export const PanelAssets = ({
	parent,
	strategyEntityNew,
	strategyReorder,
	strategyActions,
}: {
	parent: IAssetParent
	strategyEntityNew: IDashboardPanelCreateEntityStrategy
	strategyReorder: IDashboardPanelUpdateEntityOrderStrategy
	strategyActions: IDashboardPanelEntityActionStrategy
}) => {
	const groupedAssetsByType = groupAssetsByType({
		assets: parent.assets,
	})
	const assetTypePanels = assetsByTypeToPanelArray({
		assets: groupedAssetsByType,
	})

	return (
		<div>
			{assetTypePanels.map(assetTypePanel => {
				return (
					<PanelAsset
						key={assetTypePanel.type}
						parent={parent}
						assetTypePanel={assetTypePanel}
						strategyEntityNew={strategyEntityNew}
						strategyReorder={strategyReorder}
						strategyActions={strategyActions}
					/>
				)
			})}
		</div>
	)
}

export const PanelAsset = ({
	parent,
	assetTypePanel,
	strategyEntityNew,
	strategyReorder,
	strategyActions,
}: {
	parent: IAssetParent
	assetTypePanel: IAssetsByTypeWithType
	strategyEntityNew: IDashboardPanelCreateEntityStrategy
	strategyReorder: IDashboardPanelUpdateEntityOrderStrategy
	strategyActions: IDashboardPanelEntityActionStrategy
}) => {
	const { type, assets } = assetTypePanel
	return (
		<DashboardEntityPanel
			key={type}
			type={type}
			parent={parent}
			entities={assets}
			strategyEntityNew={strategyEntityNew}
			strategyReorder={strategyReorder}
			strategyActions={strategyActions}
			skipReorder={true}
		/>
	)
}
