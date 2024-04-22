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
import { SidebarPanel, SidebarPanelRowValuesContainer } from '..'
import { PanelEntityHeader } from './dashboard-entity-panel.header'
import { PanelEntityPopover } from './dashboard-entity-panel.popover'
import { PanelEntityRow } from './dashboard-entity-panel.row'

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
						entityCount={entityCount}
						entityIndex={index}
						strategyReorder={strategyReorder}
						strategyToggleVisible={strategyToggleVisible}
						strategyEntityDelete={strategyEntityDelete}
					>
						<PanelEntityValues type={type} entity={entity} />
					</PanelEntityRow>
				)
			})}
		</SidebarPanel>
	)
}

export const PanelEntityValues = ({
	type,
	entity,
}: {
	type: PanelEntityType
	entity: PanelEntity
}) => {
	return (
		<SidebarPanelRowValuesContainer>
			<PanelEntityPopover name={type}>
				<p>yo</p>
			</PanelEntityPopover>
			<div className="truncate">
				{entity.id}
				{entity.id}
			</div>
			{/*
			{layout.style === 'random' ? (
				<PanelFormDesignLayoutEditCount layout={layout} />
			) : (
				<SidebarPanelRowValuesDisabled
					value={`${layout.rows} x ${layout.columns}`}
				/>
			)} */}
		</SidebarPanelRowValuesContainer>
	)
}
