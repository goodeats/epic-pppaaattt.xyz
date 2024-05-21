import { memo, useCallback } from 'react'
import { SidebarPanelPopoverFormContainer } from '#app/components/layout/popover'
import { type ILayer } from '#app/models/layer/layer.server'
import { LayerName } from '#app/routes/resources+/api.v1+/layer.update.name'
import { type IEntity } from '#app/schema/entity'
import { SidebarPanelRowValuesContainer } from '..'
import { PanelEntityPopoverAlt } from './dashboard-entity-panel.popover.alt'

interface EntityProps {
	entity: IEntity
}

const EntityPopover = memo(({ entity }: EntityProps) => {
	return (
		<PanelEntityPopoverAlt name="Template">
			<SidebarPanelPopoverFormContainer>
				<span>Name</span>
				<LayerName layer={entity as ILayer} formLocation="popover" />
			</SidebarPanelPopoverFormContainer>
		</PanelEntityPopoverAlt>
	)
})
EntityPopover.displayName = 'EntityPopover'

const EntityMainForm = memo(({ entity }: EntityProps) => {
	return <LayerName layer={entity as ILayer} />
})
EntityMainForm.displayName = 'EntityMainForm'

export const PanelEntityValuesLayer = ({ entity }: { entity: IEntity }) => {
	const entityPopover = useCallback(
		() => <EntityPopover entity={entity} />,
		[entity],
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
