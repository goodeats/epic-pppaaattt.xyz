import { type IEntity, type IEntityParentType } from '#app/schema/entity'
import { type IDashboardPanelUpdateEntityOrderStrategy } from '#app/strategies/component/dashboard-panel/update-entity-order.strategy'
import { SidebarPanelRowReorderContainer } from '..'
import { FormFetcherMoveIcon } from '../form/fetcher/move-icon'

export const PanelEntityRowReorder = ({
	entity,
	parent,
	entityCount,
	entityIndex,
	strategyReorder,
}: {
	entity: IEntity
	parent: IEntityParentType
	entityCount: number
	entityIndex: number
	strategyReorder: IDashboardPanelUpdateEntityOrderStrategy
}) => {
	const atTop = entityIndex === 0
	const atBottom = entityIndex === entityCount - 1

	return (
		<SidebarPanelRowReorderContainer>
			<FormFetcherMoveIcon
				entityId={entity.id}
				parentId={parent.id}
				parentTypeId={strategyReorder.parentTypeId}
				route={strategyReorder.route}
				formId={strategyReorder.formId}
				schema={strategyReorder.schema}
				direction="up"
				atTopOrBottom={atTop}
			/>
			<FormFetcherMoveIcon
				entityId={entity.id}
				parentId={parent.id}
				parentTypeId={strategyReorder.parentTypeId}
				route={strategyReorder.route}
				formId={strategyReorder.formId}
				schema={strategyReorder.schema}
				direction="down"
				atTopOrBottom={atBottom}
			/>
		</SidebarPanelRowReorderContainer>
	)
}
