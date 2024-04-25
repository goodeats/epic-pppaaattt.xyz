import {
	type IEntityVisible,
	type IEntity,
	type IEntityParentType,
	type IEntityType,
	type entityParentIdTypeEnum,
} from '#app/schema/entity'
import { type IDashboardPanelCreateEntityStrategy } from '#app/strategies/component/dashboard-panel/create-entity.strategy'
import { type IDashboardPanelEntityActionStrategy } from '#app/strategies/component/dashboard-panel/entity-action/entity-action'
import { type IDashboardPanelUpdateEntityValuesStrategy } from '#app/strategies/component/dashboard-panel/update-entity/update-entity-values'
import { type IDashboardPanelUpdateEntityOrderStrategy } from '#app/strategies/component/dashboard-panel/update-entity-move.strategy'
import { SidebarPanel } from '..'
import { PanelEntityRowActions } from './dashboard-entity-panel.actions'
import { PanelEntityHeader } from './dashboard-entity-panel.header'
import { PanelEntityRow } from './dashboard-entity-panel.row'
import { PanelEntityValues } from './dashboard-entity-panel.values'

export const DashboardEntityPanel = ({
	type,
	parentTypeId,
	parent,
	entities,
	strategyEntityNew,
	strategyReorder,
	strategyEntityValues,
	strategyActions,
}: {
	type: IEntityType
	parentTypeId: entityParentIdTypeEnum
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
				parentTypeId={parentTypeId}
				parent={parent}
				strategyEntityNew={strategyEntityNew}
			/>
			{entities.map((entity, index) => {
				return (
					<PanelEntityRow
						key={index}
						entity={entity}
						parentTypeId={parentTypeId}
						parent={parent}
						entityCount={entityCount}
						entityIndex={index}
						strategyReorder={strategyReorder}
					>
						<PanelEntityValues
							type={type}
							entity={entity}
							strategyEntityValues={strategyEntityValues}
						/>
						<PanelEntityRowActions
							entity={entity as IEntityVisible}
							parent={parent}
							strategyActions={strategyActions}
						/>
					</PanelEntityRow>
				)
			})}
		</SidebarPanel>
	)
}
