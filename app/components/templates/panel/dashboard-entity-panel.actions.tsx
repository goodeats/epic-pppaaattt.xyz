import {
	type IEntityVisible,
	type IEntityParentType,
	EntityActionType,
	type IEntitySelectable,
} from '#app/schema/entity'
import { type IDashboardPanelDeleteEntityStrategy } from '#app/strategies/component/dashboard-panel/delete-entity.strategy'
import {
	type IDashboardPanelEntityActionStrategy,
	type IPanelEntityActionStrategy,
} from '#app/strategies/component/dashboard-panel/entity-action/entity-action'
import { type IDashboardPanelSelectEntityStrategy } from '#app/strategies/component/dashboard-panel/update-entity-selected.strategy'
import { type IDashboardPanelUpdateEntityVisibleStrategy } from '#app/strategies/component/dashboard-panel/update-entity-visible.strategy'
import { SidebarPanelRowActionsContainer } from '..'
import { PanelEntityDeleteAction } from './dashboard-entity-panel.actions.delete'
import { PanelEntityToggleSelectedAction } from './dashboard-entity-panel.actions.toggle-selected'
import { PanelEntityToggleVisobleAction } from './dashboard-entity-panel.actions.toggle-visible'

export const PanelEntityRowActions = ({
	entity,
	parent,
	strategyActions,
}: {
	entity: IEntityVisible
	parent: IEntityParentType
	strategyActions: IDashboardPanelEntityActionStrategy
}) => {
	const panelActions = strategyActions.getPanelActions()

	return (
		<SidebarPanelRowActionsContainer>
			{panelActions.map((panelAction, index) => {
				return (
					<PanelEntityAction
						key={index}
						entity={entity}
						parent={parent}
						panelAction={panelAction}
					/>
				)
			})}
		</SidebarPanelRowActionsContainer>
	)
}

const PanelEntityAction = ({
	entity,
	parent,
	panelAction,
}: {
	entity: IEntityVisible
	parent: IEntityParentType
	panelAction: IPanelEntityActionStrategy
}) => {
	switch (panelAction.actionType) {
		case EntityActionType.TOGGLE_VISIBLE:
			return (
				<PanelEntityToggleVisobleAction
					entity={entity as IEntityVisible}
					parent={parent}
					strategyToggleVisible={
						panelAction as IDashboardPanelUpdateEntityVisibleStrategy
					}
				/>
			)
		case EntityActionType.DELETE:
			return (
				<PanelEntityDeleteAction
					entity={entity}
					parent={parent}
					strategyEntityDelete={
						panelAction as IDashboardPanelDeleteEntityStrategy
					}
				/>
			)
		case EntityActionType.SELECT:
			return (
				<PanelEntityToggleSelectedAction
					entity={entity as IEntitySelectable}
					parent={parent}
					strategyEntitySelect={
						panelAction as IDashboardPanelSelectEntityStrategy
					}
				/>
			)
		default:
			return null
	}
}
