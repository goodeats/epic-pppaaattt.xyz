import { DashboardEntityPanel } from '#app/components/templates/panel/dashboard-entity-panel'
import { type IDesignWithType } from '#app/models/design.server'
import { type designTypeEnum, type DesignParentType } from '#app/schema/design'
import { type IDashboardPanelCreateEntityStrategy } from '#app/strategies/component/dashboard-panel/create-entity.strategy'
import { type IDashboardPanelEntityActionStrategy } from '#app/strategies/component/dashboard-panel/entity-action/entity-action'
import { type IDashboardPanelUpdateEntityValuesStrategy } from '#app/strategies/component/dashboard-panel/update-entity/update-entity-values'
import { type IDashboardPanelUpdateEntityOrderStrategy } from '#app/strategies/component/dashboard-panel/update-entity-order.strategy'
import {
	designsByTypeToPanelArray,
	filterAndOrderDesignsByType,
} from '#app/utils/design'

export const PanelDesigns = ({
	parent,
	strategyEntityNew,
	strategyReorder,
	strategyActions,
}: {
	parent: DesignParentType
	strategyEntityNew: IDashboardPanelCreateEntityStrategy
	strategyReorder: IDashboardPanelUpdateEntityOrderStrategy
	strategyActions: IDashboardPanelEntityActionStrategy
}) => {
	const orderedDesigns = filterAndOrderDesignsByType({
		designs: parent.designs,
	})
	const designTypePanels = designsByTypeToPanelArray({
		designs: orderedDesigns,
	})

	return (
		<div>
			{designTypePanels.map((designTypePanel, index) => {
				return (
					<PanelDesign
						key={index}
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
	parent: DesignParentType
	designTypePanel: {
		type: designTypeEnum
		designs: IDesignWithType[]
		strategyEntityValues: IDashboardPanelUpdateEntityValuesStrategy
	}
	strategyEntityNew: IDashboardPanelCreateEntityStrategy
	strategyReorder: IDashboardPanelUpdateEntityOrderStrategy
	strategyActions: IDashboardPanelEntityActionStrategy
}) => {
	const { type, designs, strategyEntityValues } = designTypePanel
	return (
		<DashboardEntityPanel
			key={type}
			type={type}
			parent={parent}
			entities={designs}
			strategyEntityNew={strategyEntityNew}
			strategyReorder={strategyReorder}
			strategyEntityValues={strategyEntityValues}
			strategyActions={strategyActions}
		/>
	)
}
