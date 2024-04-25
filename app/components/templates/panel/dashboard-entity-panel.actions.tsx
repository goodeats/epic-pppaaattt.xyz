import {
	type IEntityVisible,
	type IEntityParentType,
	EntityActionType,
} from '#app/schema/entity'
import { type IDashboardPanelDeleteEntityStrategy } from '#app/strategies/component/dashboard-panel/delete-entity.strategy'
import {
	type IDashboardPanelEntityActionStrategy,
	type IPanelEntityActionStrategy,
} from '#app/strategies/component/dashboard-panel/entity-action/entity-action'
import { type IDashboardPanelUpdateEntityVisibleStrategy } from '#app/strategies/component/dashboard-panel/update-entity-visible.strategy'
import { SidebarPanelRowActionsContainer } from '..'
import { FormFetcherIcon } from '../form/fetcher/icon'

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
				<PanelEntityToggleVisbleAction
					entity={entity}
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
		default:
			return null
	}
}

export const PanelEntityToggleVisbleAction = ({
	entity,
	parent,
	strategyToggleVisible,
}: {
	entity: IEntityVisible
	parent: IEntityParentType
	strategyToggleVisible: IDashboardPanelUpdateEntityVisibleStrategy
}) => {
	return (
		<FormFetcherIcon
			entityId={entity.id}
			parentId={parent.id}
			parentTypeId={strategyToggleVisible.parentTypeId}
			route={strategyToggleVisible.route}
			formId={strategyToggleVisible.formId}
			schema={strategyToggleVisible.schema}
			icon={entity.visible ? 'eye-open' : 'eye-closed'}
			iconText={`${entity.visible ? 'Hide' : 'Show'} ${
				strategyToggleVisible.iconText
			}`}
		/>
	)
}

export const PanelEntityDeleteAction = ({
	entity,
	parent,
	strategyEntityDelete,
}: {
	entity: IEntityVisible
	parent: IEntityParentType
	strategyEntityDelete: IDashboardPanelDeleteEntityStrategy
}) => {
	return (
		<FormFetcherIcon
			entityId={entity.id}
			parentId={parent.id}
			parentTypeId={strategyEntityDelete.parentTypeId}
			route={strategyEntityDelete.route}
			formId={strategyEntityDelete.formId}
			schema={strategyEntityDelete.schema}
			icon="minus"
			iconText={strategyEntityDelete.iconText}
		/>
	)
}
