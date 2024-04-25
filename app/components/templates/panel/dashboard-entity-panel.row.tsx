import {
	type IEntity,
	type IEntityParentType,
	type entityParentIdTypeEnum,
} from '#app/schema/entity'
import { type IDashboardPanelUpdateEntityOrderStrategy } from '#app/strategies/component/dashboard-panel/update-entity-move.strategy'
import { SidebarPanelRow, SidebarPanelRowContainer } from '..'
import { PanelEntityRowReorder } from './dashboard-entity-panel.reorder'

export const PanelEntityRow = ({
	entity,
	parentTypeId,
	parent,
	entityCount,
	entityIndex,
	strategyReorder,
	children,
}: {
	entity: IEntity
	parentTypeId: entityParentIdTypeEnum
	parent: IEntityParentType
	entityCount: number
	entityIndex: number
	strategyReorder: IDashboardPanelUpdateEntityOrderStrategy
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
			<SidebarPanelRowContainer>{children}</SidebarPanelRowContainer>
		</SidebarPanelRow>
	)
}
