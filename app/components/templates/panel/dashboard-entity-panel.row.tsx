import { type IArtboardVersionWithDesignsAndLayers } from '#app/models/artboard-version/artboard-version.server'
import { type IDesignWithType } from '#app/models/design.server'
import { type designParentTypeIdEnum } from '#app/schema/design'
import { type IDashboardPanelDeleteEntityStrategy } from '#app/strategies/component/dashboard-panel/delete-entity.strategy'
import { type IDashboardPanelUpdateEntityOrderStrategy } from '#app/strategies/component/dashboard-panel/update-entity-move.strategy'
import { type IDashboardPanelUpdateEntityVisibleStrategy } from '#app/strategies/component/dashboard-panel/update-entity-visible.strategy'
import { SidebarPanelRow, SidebarPanelRowContainer } from '..'
import { PanelEntityRowActions } from './dashboard-entity-panel.actions'
import { PanelEntityRowReorder } from './dashboard-entity-panel.reorder'

type PanelEntity = IDesignWithType
type PanelEntityParent = IArtboardVersionWithDesignsAndLayers

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
	entity: PanelEntity
	parentTypeId: designParentTypeIdEnum
	parent: PanelEntityParent
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
					entity={entity}
					parentTypeId={parentTypeId}
					parent={parent}
					strategyToggleVisible={strategyToggleVisible}
					strategyEntityDelete={strategyEntityDelete}
				/>
			</SidebarPanelRowContainer>
		</SidebarPanelRow>
	)
}
