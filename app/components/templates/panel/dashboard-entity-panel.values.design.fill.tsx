import { memo, useCallback } from 'react'
import { SidebarPanelPopoverFormContainer } from '#app/components/layout/popover'
import { type IDesignWithFill } from '#app/models/design/design.server'
import { DesignTypeFillBasis } from '#app/routes/resources+/api.v1+/design.type.fill.update.basis'
import { DesignTypeFillStyle } from '#app/routes/resources+/api.v1+/design.type.fill.update.style'
import { DesignTypeFillValue } from '#app/routes/resources+/api.v1+/design.type.fill.update.value'
import { type IEntity } from '#app/schema/entity'
import { FillBasisTypeEnum, FillStyleTypeEnum } from '#app/schema/fill'
import { SidebarPanelRowValuesContainer } from '..'
import { PanelEntityPopover } from './dashboard-entity-panel.popover'

interface EntityProps {
	entity: IEntity
}

const EntityPopover = memo(({ entity }: EntityProps) => {
	// display color on popover trigger if fill is defined and solid
	const { fill } = entity as IDesignWithFill
	const { basis, value } = fill
	const displayColor =
		basis === FillBasisTypeEnum.DEFINED && FillStyleTypeEnum.SOLID
	const backgroundColor = displayColor ? value : undefined

	return (
		<PanelEntityPopover name="Fill" backgroundColor={backgroundColor}>
			<SidebarPanelPopoverFormContainer>
				<span>Value</span>
				<DesignTypeFillValue
					design={entity as IDesignWithFill}
					formLocation="popover"
				/>
			</SidebarPanelPopoverFormContainer>
			<SidebarPanelPopoverFormContainer>
				<span>Basis</span>
				<DesignTypeFillBasis
					design={entity as IDesignWithFill}
					formLocation="popover"
				/>
			</SidebarPanelPopoverFormContainer>
			<SidebarPanelPopoverFormContainer>
				<span>Style</span>
				<DesignTypeFillStyle
					design={entity as IDesignWithFill}
					formLocation="popover"
				/>
			</SidebarPanelPopoverFormContainer>
		</PanelEntityPopover>
	)
})
EntityPopover.displayName = 'EntityPopover'

const EntityMainForm = memo(({ entity }: EntityProps) => {
	const { fill } = entity as IDesignWithFill
	const { basis, style } = fill

	if (style === FillStyleTypeEnum.NONE) {
		return <DesignTypeFillStyle design={entity as IDesignWithFill} />
	} else if (basis !== FillBasisTypeEnum.DEFINED) {
		return <DesignTypeFillBasis design={entity as IDesignWithFill} />
	}

	return <DesignTypeFillValue design={entity as IDesignWithFill} />
})
EntityMainForm.displayName = 'EntityMainForm'

export const PanelEntityValuesDesignFill = ({
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
