import { memo, useCallback } from 'react'
import { SidebarPanelPopoverFormContainer } from '#app/components/layout/popover'
import { Separator } from '#app/components/ui/separator'
import { type IArtboardVersion } from '#app/models/artboard-version/artboard-version.server'
import { type ILayer } from '#app/models/layer/layer.server'
import { ArtboardVersionLayerDelete } from '#app/routes/resources+/api.v1+/artboard-version.layer.delete'
import { LayerDescription } from '#app/routes/resources+/api.v1+/layer.update.description'
import { LayerName } from '#app/routes/resources+/api.v1+/layer.update.name'
import { type IEntityParentType, type IEntity } from '#app/schema/entity'
import { SidebarPanelRowValuesContainer } from '..'
import { PanelEntityPopoverAlt } from './dashboard-entity-panel.popover.alt'

interface EntityProps {
	entity: IEntity
	parent?: IEntityParentType
}

const EntityPopover = memo(({ entity, parent }: EntityProps) => {
	return (
		<PanelEntityPopoverAlt name="Template">
			<SidebarPanelPopoverFormContainer>
				<span>Name</span>
				<LayerName layer={entity as ILayer} formLocation="popover" />
			</SidebarPanelPopoverFormContainer>
			<SidebarPanelPopoverFormContainer>
				<span>Description</span>
				<LayerDescription layer={entity as ILayer} formLocation="popover" />
			</SidebarPanelPopoverFormContainer>
			<Separator className="my-4" />
			<SidebarPanelPopoverFormContainer>
				<span>Delete</span>
				<ArtboardVersionLayerDelete
					layer={entity as ILayer}
					artboardVersion={parent as IArtboardVersion}
					formLocation="popover"
				/>
			</SidebarPanelPopoverFormContainer>
		</PanelEntityPopoverAlt>
	)
})
EntityPopover.displayName = 'EntityPopover'

const EntityMainForm = memo(({ entity }: EntityProps) => {
	return <LayerName layer={entity as ILayer} />
})
EntityMainForm.displayName = 'EntityMainForm'

export const PanelEntityValuesLayer = ({
	entity,
	parent,
}: {
	entity: IEntity
	parent: IEntityParentType
}) => {
	const entityPopover = useCallback(
		() => <EntityPopover entity={entity} parent={parent} />,
		[entity, parent],
	)

	const entityMainForm = useCallback(
		() => <EntityMainForm entity={entity} />,
		[entity],
	)

	return (
		<SidebarPanelRowValuesContainer>
			{entityPopover()}
			{entityMainForm()}
		</SidebarPanelRowValuesContainer>
	)
}
