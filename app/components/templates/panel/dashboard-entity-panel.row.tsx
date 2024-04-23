import {
	type IEntityVisible,
	type IEntity,
	type IEntityParentType,
	type entityParentIdTypeEnum,
} from '#app/schema/entity'
import { type IDashboardPanelDeleteEntityStrategy } from '#app/strategies/component/dashboard-panel/delete-entity.strategy'
import { type IDashboardPanelUpdateEntityOrderStrategy } from '#app/strategies/component/dashboard-panel/update-entity-move.strategy'
import { type IDashboardPanelUpdateEntityVisibleStrategy } from '#app/strategies/component/dashboard-panel/update-entity-visible.strategy'
import { SidebarPanelRow, SidebarPanelRowContainer } from '..'
import { PanelEntityRowActions } from './dashboard-entity-panel.actions'
import { PanelEntityRowReorder } from './dashboard-entity-panel.reorder'

export const PanelEntityRow = ({
	entity,
	parentTypeId,
	parent,
	entityCount,
	entityIndex,
	strategyReorder,
	strategyToggleVisible,
	strategyEntityDelete,
	children,
}: {
	entity: IEntity
	parentTypeId: entityParentIdTypeEnum
	parent: IEntityParentType
	entityCount: number
	entityIndex: number
	strategyReorder: IDashboardPanelUpdateEntityOrderStrategy
	strategyToggleVisible: IDashboardPanelUpdateEntityVisibleStrategy
	strategyEntityDelete: IDashboardPanelDeleteEntityStrategy
	children: React.ReactNode
}) => {
	return (
		<SidebarPanelRow>
			<PanelEntityRowReorder
				entity={entity}
				parentTypeId={parentTypeId}
				parent={parent}
				entityCount={entityCount}
				entityIndex={entityIndex}
				strategyReorder={strategyReorder}
			/>
			<SidebarPanelRowContainer>
				{children}
				<PanelEntityRowActions
					entity={entity as IEntityVisible}
					parentTypeId={parentTypeId}
					parent={parent}
					strategyToggleVisible={strategyToggleVisible}
					strategyEntityDelete={strategyEntityDelete}
				/>
			</SidebarPanelRowContainer>
		</SidebarPanelRow>
	)
}
