import { type IArtboardVersionWithDesignsAndLayers } from '#app/models/artboard-version/artboard-version.server'
import { type IDesignWithType } from '#app/models/design.server'
import {
	type designParentTypeIdEnum,
	type designTypeEnum,
} from '#app/schema/design'
import { type defaultValueNumber } from '#app/schema/zod-helpers'
import { type IDashboardPanelCreateEntityStrategy } from '#app/strategies/component/dashboard-panel/create-entity.strategy'
import { type IDashboardPanelDeleteEntityStrategy } from '#app/strategies/component/dashboard-panel/delete-entity.strategy'
import { type IDashboardPanelUpdateEntityValuesStrategy } from '#app/strategies/component/dashboard-panel/update-entity/update-entity-values'
import { type IDashboardPanelUpdateEntityOrderStrategy } from '#app/strategies/component/dashboard-panel/update-entity-move.strategy'
import { type IDashboardPanelUpdateEntityVisibleStrategy } from '#app/strategies/component/dashboard-panel/update-entity-visible.strategy'
import { SidebarPanel, SidebarPanelRowValuesContainer } from '..'
import { FormFetcherNumber } from '../form/fetcher/number'
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
	strategyEntityValues,
	strategyToggleVisible,
	strategyEntityDelete,
}: {
	type: PanelEntityType
	parentTypeId: designParentTypeIdEnum
	parent: PanelEntityParent
	entities: PanelEntities
	strategyEntityNew: IDashboardPanelCreateEntityStrategy
	strategyReorder: IDashboardPanelUpdateEntityOrderStrategy
	strategyEntityValues: IDashboardPanelUpdateEntityValuesStrategy
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
						<PanelEntityValues
							type={type}
							entity={entity}
							strategyEntityValues={strategyEntityValues}
						/>
					</PanelEntityRow>
				)
			})}
		</SidebarPanel>
	)
}

export const PanelEntityValues = ({
	type,
	entity,
	strategyEntityValues,
}: {
	type: PanelEntityType
	entity: PanelEntity
	strategyEntityValues: IDashboardPanelUpdateEntityValuesStrategy
}) => {
	const getMainPanelFormStrategy = strategyEntityValues.getMainPanelForm({
		entity,
	})
	return (
		<SidebarPanelRowValuesContainer>
			<PanelEntityPopover name={type}>
				<p>yo</p>
			</PanelEntityPopover>
			<FormFetcherNumber
				entityId={getMainPanelFormStrategy.entityId}
				defaultValue={
					getMainPanelFormStrategy.defaultValue as defaultValueNumber
				}
				parentId={getMainPanelFormStrategy.parentId}
				parentTypeId={getMainPanelFormStrategy.parentTypeId}
				route={getMainPanelFormStrategy.route}
				formId={getMainPanelFormStrategy.formId}
				schema={getMainPanelFormStrategy.schema}
			/>
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
