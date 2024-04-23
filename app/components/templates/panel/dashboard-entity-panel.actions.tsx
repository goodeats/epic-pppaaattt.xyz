import {
	type IEntityVisible,
	type IEntityParentType,
	type entityParentIdTypeEnum,
} from '#app/schema/entity'
import { type IDashboardPanelDeleteEntityStrategy } from '#app/strategies/component/dashboard-panel/delete-entity.strategy'
import { type IDashboardPanelUpdateEntityVisibleStrategy } from '#app/strategies/component/dashboard-panel/update-entity-visible.strategy'
import { SidebarPanelRowActionsContainer } from '..'
import { FormFetcherIcon } from '../form/fetcher/icon'

export const PanelEntityRowActions = ({
	entity,
	parentTypeId,
	parent,
	strategyToggleVisible,
	strategyEntityDelete,
}: {
	entity: IEntityVisible
	parentTypeId: entityParentIdTypeEnum
	parent: IEntityParentType
	strategyToggleVisible: IDashboardPanelUpdateEntityVisibleStrategy
	strategyEntityDelete: IDashboardPanelDeleteEntityStrategy
}) => {
	return (
		<SidebarPanelRowActionsContainer>
			<FormFetcherIcon
				entityId={entity.id}
				parentTypeId={parentTypeId}
				parentId={parent.id}
				route={strategyToggleVisible.route}
				formId={strategyToggleVisible.formId}
				schema={strategyToggleVisible.schema}
				icon={entity.visible ? 'eye-open' : 'eye-closed'}
				iconText={`${entity.visible ? 'Hide' : 'Show'} ${
					strategyToggleVisible.iconText
				}`}
			/>
			<FormFetcherIcon
				entityId={entity.id}
				parentTypeId={parentTypeId}
				parentId={parent.id}
				route={strategyEntityDelete.route}
				formId={strategyEntityDelete.formId}
				schema={strategyEntityDelete.schema}
				icon="minus"
				iconText={strategyEntityDelete.iconText}
			/>
		</SidebarPanelRowActionsContainer>
	)
}
