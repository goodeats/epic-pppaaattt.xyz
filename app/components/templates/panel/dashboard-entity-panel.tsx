import {
	type IEntityVisible,
	type IEntity,
	type IEntityParentType,
	type IEntityType,
	type IEntitySelectable,
} from '#app/schema/entity'
import { type IDashboardPanelCreateEntityStrategy } from '#app/strategies/component/dashboard-panel/create-entity.strategy'
import { type IDashboardPanelEntityActionStrategy } from '#app/strategies/component/dashboard-panel/entity-action/entity-action'
import { type IDashboardPanelUpdateEntityValuesStrategy } from '#app/strategies/component/dashboard-panel/update-entity/update-entity-values'
import { type IDashboardPanelUpdateEntityOrderStrategy } from '#app/strategies/component/dashboard-panel/update-entity-order.strategy'
import { SidebarPanel, SidebarPanelRow, SidebarPanelRowContainer } from '..'
import { PanelEntityRowActions } from './dashboard-entity-panel.actions'
import { PanelEntityHeader } from './dashboard-entity-panel.header'
import { PanelEntityRowReorder } from './dashboard-entity-panel.reorder'
import { PanelEntityValues } from './dashboard-entity-panel.values'

export const DashboardEntityPanel = ({
	type,
	parent,
	entities,
	strategyEntityNew,
	strategyReorder,
	strategyEntityValues,
	strategyActions,
}: {
	type: IEntityType
	parent: IEntityParentType
	entities: IEntity[]
	strategyEntityNew: IDashboardPanelCreateEntityStrategy
	strategyReorder: IDashboardPanelUpdateEntityOrderStrategy
	strategyEntityValues: IDashboardPanelUpdateEntityValuesStrategy
	strategyActions: IDashboardPanelEntityActionStrategy
}) => {
	const entityCount = entities.length

	return (
		<SidebarPanel>
			<PanelEntityHeader
				type={type}
				parent={parent}
				strategyEntityNew={strategyEntityNew}
			/>
			{entities.map((entity, index) => {
				return (
					<SidebarPanelRow key={entity.id}>
						<PanelEntityRowReorder
							entity={entity}
							parent={parent}
							atTop={index === 0}
							atBottom={index === entityCount - 1}
							strategyReorder={strategyReorder}
						/>
						<SidebarPanelRowContainer>
							<PanelEntityValues type={type} entity={entity} parent={parent} />
							<PanelEntityRowActions
								entity={entity as IEntityVisible | IEntitySelectable}
								parent={parent}
								strategyActions={strategyActions}
							/>
						</SidebarPanelRowContainer>
					</SidebarPanelRow>
				)
			})}
		</SidebarPanel>
	)
}
