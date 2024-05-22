import { memo, useCallback } from 'react'
import { SidebarPanelPopoverFormContainer } from '#app/components/layout/popover'
import { Separator } from '#app/components/ui/separator'
import { type IArtworkVersion } from '#app/models/artwork-version/artwork-version.server'
import { type ILayer } from '#app/models/layer/layer.server'
import { LayerDescription } from '#app/routes/resources+/api.v1+/layer.update.description'
import { LayerName } from '#app/routes/resources+/api.v1+/layer.update.name'
import { type IEntityParentType, type IEntity } from '#app/schema/entity'
import { SidebarPanelRowValuesContainer } from '..'
import { PanelEntityPopover } from './dashboard-entity-panel.popover'
import { ArtworkVersionLayerDelete } from '#app/routes/resources+/api.v1+/artwork-version.layer.delete'

interface EntityProps {
	entity: IEntity
	parent?: IEntityParentType
}

const EntityPopover = memo(({ entity, parent }: EntityProps) => {
	return (
		<PanelEntityPopover name="Template">
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
				<ArtworkVersionLayerDelete
					layer={entity as ILayer}
					artworkVersion={parent as IArtworkVersion}
					formLocation="popover"
				/>
			</SidebarPanelPopoverFormContainer>
		</PanelEntityPopover>
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
