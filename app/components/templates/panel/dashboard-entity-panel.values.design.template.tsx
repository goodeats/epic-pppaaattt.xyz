import { memo, useCallback } from 'react'
import { SidebarPanelPopoverFormContainer } from '#app/components/layout/popover'
import { type IDesignWithTemplate } from '#app/models/design/design.server'
import { DesignTypeTemplateStyle } from '#app/routes/resources+/api.v1+/design.type.template.update.style'
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
				<span>Style</span>
				<DesignTypeTemplateStyle
					design={entity as IDesignWithTemplate}
					formLocation="popover"
				/>
			</SidebarPanelPopoverFormContainer>
		</PanelEntityPopoverAlt>
	)
})
EntityPopover.displayName = 'EntityPopover'

const EntityMainForm = memo(({ entity }: EntityProps) => {
	return <DesignTypeTemplateStyle design={entity as IDesignWithTemplate} />
})
EntityMainForm.displayName = 'EntityMainForm'

export const PanelEntityValuesDesignTemplate = ({
	entity,
}: {
	entity: IEntity
}) => {
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
