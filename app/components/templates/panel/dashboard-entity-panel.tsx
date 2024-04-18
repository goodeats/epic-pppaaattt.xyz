import { type IArtboardVersionWithDesignsAndLayers } from '#app/models/artboard-version/artboard-version.server'
import { type IDesignWithType } from '#app/models/design.server'
import { type designTypeEnum } from '#app/schema/design'
import { capitalize } from '#app/utils/string-formatting'
import {
	SidebarPanel,
	SidebarPanelHeader,
	SidebarPanelRow,
	SidebarPanelRowActionsContainer,
} from '..'

type PanelEntities = IDesignWithType[]
type PanelEntity = IDesignWithType
type PanelEntityType = designTypeEnum
type PanelEntityParent = IArtboardVersionWithDesignsAndLayers

export const DashboardEntityPanel = ({
	type,
	parent,
	entities,
}: {
	type: PanelEntityType
	parent: PanelEntityParent
	entities: PanelEntities
}) => {
	return (
		<SidebarPanel>
			<PanelEntityHeader type={type} parent={parent} />
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
	parent,
}: {
	type: PanelEntityType
	parent: PanelEntityParent
}) => {
	return (
		<SidebarPanelHeader title={capitalize(type)}>
			<SidebarPanelRowActionsContainer>New</SidebarPanelRowActionsContainer>
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
