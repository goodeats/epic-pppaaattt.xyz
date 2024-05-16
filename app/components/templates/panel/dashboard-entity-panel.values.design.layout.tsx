import { memo, useCallback } from 'react'
import { SidebarPanelPopoverFormContainer } from '#app/components/layout/popover'
import { type IDesignWithLayout } from '#app/models/design/design.server'
import { DesignTypeLayoutColumns } from '#app/routes/resources+/api.v1+/design.type.layout.update.columns'
import { DesignTypeLayoutCount } from '#app/routes/resources+/api.v1+/design.type.layout.update.count'
import { DesignTypeLayoutRows } from '#app/routes/resources+/api.v1+/design.type.layout.update.rows'
import { DesignTypeLayoutStyle } from '#app/routes/resources+/api.v1+/design.type.layout.update.style'
import { type IEntity } from '#app/schema/entity'
import { LayoutStyleTypeEnum } from '#app/schema/layout'
import { SidebarPanelRowValuesContainer } from '..'
import { PanelEntityPopoverAlt } from './dashboard-entity-panel.popover.alt'

interface EntityProps {
	entity: IEntity
}

const EntityPopover = memo(({ entity }: EntityProps) => {
	return (
		<PanelEntityPopoverAlt name="Layout">
			<SidebarPanelPopoverFormContainer>
				<span>Style</span>
				<DesignTypeLayoutStyle
					design={entity as IDesignWithLayout}
					formLocation="popover"
				/>
			</SidebarPanelPopoverFormContainer>
			<SidebarPanelPopoverFormContainer>
				<span>Count</span>
				<DesignTypeLayoutCount
					design={entity as IDesignWithLayout}
					formLocation="popover"
				/>
			</SidebarPanelPopoverFormContainer>
			<SidebarPanelPopoverFormContainer>
				<span>Rows</span>
				<DesignTypeLayoutRows
					design={entity as IDesignWithLayout}
					formLocation="popover"
				/>
			</SidebarPanelPopoverFormContainer>
			<SidebarPanelPopoverFormContainer>
				<span>Columns</span>
				<DesignTypeLayoutColumns
					design={entity as IDesignWithLayout}
					formLocation="popover"
				/>
			</SidebarPanelPopoverFormContainer>
		</PanelEntityPopoverAlt>
	)
})
EntityPopover.displayName = 'EntityPopover'

const EntityMainForm = memo(({ entity }: EntityProps) => {
	const { layout } = entity as IDesignWithLayout
	const { style } = layout

	if (style === LayoutStyleTypeEnum.RANDOM) {
		return <DesignTypeLayoutCount design={entity as IDesignWithLayout} />
	}

	return (
		<div className="flex">
			<DesignTypeLayoutRows design={entity as IDesignWithLayout} />
			<DesignTypeLayoutColumns design={entity as IDesignWithLayout} />
		</div>
	)
})
EntityMainForm.displayName = 'EntityMainForm'

export const PanelEntityValuesDesignLayout = ({
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
