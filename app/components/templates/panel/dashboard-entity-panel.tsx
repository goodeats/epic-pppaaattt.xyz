import { type IArtboardVersionWithDesignsAndLayers } from '#app/models/artboard-version/artboard-version.server'
import { type IDesignWithType } from '#app/models/design.server'
import {
	type designParentTypeIdEnum,
	type designTypeEnum,
} from '#app/schema/design'
import { type IDashboardPanelCreateEntityStrategy } from '#app/strategies/component/dashboard-panel/create-entity.strategy'
import { capitalize } from '#app/utils/string-formatting'
import {
	SidebarPanel,
	SidebarPanelHeader,
	SidebarPanelRow,
	SidebarPanelRowActionsContainer,
} from '..'
import { FormFetcherIcon } from '../form/fetcher/icon'

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
}: {
	type: PanelEntityType
	parentTypeId: designParentTypeIdEnum
	parent: PanelEntityParent
	entities: PanelEntities
	strategyEntityNew: IDashboardPanelCreateEntityStrategy
}) => {
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
						type={type}
						parent={parent}
						entity={entity}
					/>
				)
			})}
		</SidebarPanel>
	)
}

export const PanelEntityHeader = ({
	type,
	parentTypeId,
	parent,
	strategyEntityNew,
}: {
	type: PanelEntityType
	parentTypeId: designParentTypeIdEnum
	parent: PanelEntityParent
	strategyEntityNew: IDashboardPanelCreateEntityStrategy
}) => {
	return (
		<SidebarPanelHeader title={capitalize(type)}>
			<SidebarPanelRowActionsContainer>
				<FormFetcherIcon
					type={type}
					parentTypeId={parentTypeId}
					parentId={parent.id}
					route={strategyEntityNew.route}
					formId="panel-form-artboard-version-background"
					schema={strategyEntityNew.schema}
					icon="plus"
					iconText={strategyEntityNew.iconText}
				/>
			</SidebarPanelRowActionsContainer>
		</SidebarPanelHeader>
	)
}

export const PanelEntityRow = ({
	type,
	parent,
	entity,
}: {
	type: PanelEntityType
	parent: PanelEntityParent
	entity: PanelEntity
}) => {
	return (
		<SidebarPanelRow>
			<div className="truncate">
				{entity.id}
				{entity.id}
			</div>
		</SidebarPanelRow>
	)
}
