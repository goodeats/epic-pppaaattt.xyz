import { type IArtboardVersionWithDesignsAndLayers } from '#app/models/artboard-version/artboard-version.server'
import { type IDesignWithType } from '#app/models/design.server'
import {
	type designParentTypeIdEnum,
	type designTypeEnum,
} from '#app/schema/design'
import { type IDashboardPanelCreateEntityStrategy } from '#app/strategies/component/dashboard-panel/create-entity.strategy'
import { type IDashboardPanelDeleteEntityStrategy } from '#app/strategies/component/dashboard-panel/delete-entity.strategy'
import { type IDashboardPanelUpdateEntityOrderStrategy } from '#app/strategies/component/dashboard-panel/update-entity-move.strategy'
import { type IDashboardPanelUpdateEntityVisibleStrategy } from '#app/strategies/component/dashboard-panel/update-entity-visible.strategy'
import { SidebarPanel, SidebarPanelRow, SidebarPanelRowContainer } from '..'
import { PanelEntityRowActions } from './dashboard-entity-panel.actions'
import { PanelEntityHeader } from './dashboard-entity-panel.header'
import { PanelEntityRowReorder } from './dashboard-entity-panel.reorder'

type PanelEntities = IDesignWithType[]
type PanelEntity = IDesignWithType
type PanelEntityType = designTypeEnum
type PanelEntityParent = IArtboardVersionWithDesignsAndLayers

export const DashboardEntityPanel = ({
	type,
	parentTypeId,
	parent,
	entities,
	strategyEntityNew,
	strategyReorder,
	strategyToggleVisible,
	strategyEntityDelete,
}: {
	type: PanelEntityType
	parentTypeId: designParentTypeIdEnum
	parent: PanelEntityParent
	entities: PanelEntities
	strategyEntityNew: IDashboardPanelCreateEntityStrategy
	strategyReorder: IDashboardPanelUpdateEntityOrderStrategy
	strategyToggleVisible: IDashboardPanelUpdateEntityVisibleStrategy
	strategyEntityDelete: IDashboardPanelDeleteEntityStrategy
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
						type={type}
						entityCount={entityCount}
						entityIndex={index}
						strategyReorder={strategyReorder}
						strategyToggleVisible={strategyToggleVisible}
						strategyEntityDelete={strategyEntityDelete}
					/>
				)
			})}
		</SidebarPanel>
	)
}

export const PanelEntityRow = ({
	entity,
	parentTypeId,
	parent,
	type,
	entityCount,
	entityIndex,
	strategyReorder,
	strategyToggleVisible,
	strategyEntityDelete,
}: {
	entity: PanelEntity
	parentTypeId: designParentTypeIdEnum
	parent: PanelEntityParent
	type: PanelEntityType
	entityCount: number
	entityIndex: number
	strategyReorder: IDashboardPanelUpdateEntityOrderStrategy
	strategyToggleVisible: IDashboardPanelUpdateEntityVisibleStrategy
	strategyEntityDelete: IDashboardPanelDeleteEntityStrategy
}) => {
	// will want count, index of row
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
				<div className="truncate">
					{entity.id}
					{entity.id}
				</div>
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
