import { DashboardEntityPanel } from '#app/components/templates/panel/dashboard-entity-panel'
import {
	type IDesignParent,
	type IDesignsByTypeWithType,
} from '#app/models/design/design.server'
import {
	designsByTypeToPanelArray,
	groupDesignsByType,
} from '#app/models/design/utils'
import { type IDashboardPanelCreateEntityStrategy } from '#app/strategies/component/dashboard-panel/create-entity.strategy'
import { type IDashboardPanelEntityActionStrategy } from '#app/strategies/component/dashboard-panel/entity-action/entity-action'
import { type IDashboardPanelUpdateEntityOrderStrategy } from '#app/strategies/component/dashboard-panel/update-entity-order.strategy'

export const PanelDesigns = ({
	parent,
	strategyEntityNew,
	strategyReorder,
	strategyActions,
}: {
	parent: IDesignParent
	strategyEntityNew: IDashboardPanelCreateEntityStrategy
	strategyReorder: IDashboardPanelUpdateEntityOrderStrategy
	strategyActions: IDashboardPanelEntityActionStrategy
}) => {
	const groupedDesignsByType = groupDesignsByType({
		designs: parent.designs,
	})
	const designTypePanels = designsByTypeToPanelArray({
		designs: groupedDesignsByType,
	})

	return (
		<div>
			{designTypePanels.map(designTypePanel => {
				return (
					<PanelDesign
						key={designTypePanel.type}
						parent={parent}
						designTypePanel={designTypePanel}
						strategyEntityNew={strategyEntityNew}
						strategyReorder={strategyReorder}
						strategyActions={strategyActions}
					/>
				)
			})}
		</div>
	)
}

export const PanelDesign = ({
	parent,
	designTypePanel,
	strategyEntityNew,
	strategyReorder,
	strategyActions,
}: {
	parent: IDesignParent
	designTypePanel: IDesignsByTypeWithType
	strategyEntityNew: IDashboardPanelCreateEntityStrategy
	strategyReorder: IDashboardPanelUpdateEntityOrderStrategy
	strategyActions: IDashboardPanelEntityActionStrategy
}) => {
	const { type, designs } = designTypePanel
	return (
		<DashboardEntityPanel
			key={type}
			type={type}
			parent={parent}
			entities={designs}
			strategyEntityNew={strategyEntityNew}
			strategyReorder={strategyReorder}
			strategyActions={strategyActions}
		/>
	)
}
