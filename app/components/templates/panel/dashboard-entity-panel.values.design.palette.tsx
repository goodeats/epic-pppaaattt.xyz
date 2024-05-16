import { memo, useCallback } from 'react'
import { SidebarPanelPopoverFormContainer } from '#app/components/layout/popover'
import { type IDesignWithPalette } from '#app/models/design/design.server'
import { DesignTypePaletteValue } from '#app/routes/resources+/api.v1+/design.type.palette.update.value'
import { type IEntity } from '#app/schema/entity'
import { SidebarPanelRowValuesContainer } from '..'
import { PanelEntityPopoverAlt } from './dashboard-entity-panel.popover.alt'

interface EntityProps {
	entity: IEntity
}

const EntityPopover = memo(({ entity }: EntityProps) => {
	const backgroundColor = (entity as IDesignWithPalette).palette.value

	return (
		<PanelEntityPopoverAlt name="Palette" backgroundColor={backgroundColor}>
			<SidebarPanelPopoverFormContainer>
				<span>Value</span>
				<DesignTypePaletteValue
					design={entity as IDesignWithPalette}
					formLocation="popover"
				/>
			</SidebarPanelPopoverFormContainer>
		</PanelEntityPopoverAlt>
	)
})
EntityPopover.displayName = 'EntityPopover'

const EntityMainForm = memo(({ entity }: EntityProps) => {
	return <DesignTypePaletteValue design={entity as IDesignWithPalette} />
})
EntityMainForm.displayName = 'EntityMainForm'

export const PanelEntityValuesDesignPalette = ({
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
