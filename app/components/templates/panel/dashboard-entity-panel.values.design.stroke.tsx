import { memo, useCallback } from 'react'
import { SidebarPanelPopoverFormContainer } from '#app/components/layout/popover'
import { type IDesignWithStroke } from '#app/models/design/design.server'
import { DesignTypeStrokeBasis } from '#app/routes/resources+/api.v1+/design.type.stroke.update.basis'
import { DesignTypeStrokeStyle } from '#app/routes/resources+/api.v1+/design.type.stroke.update.style'
import { DesignTypeStrokeValue } from '#app/routes/resources+/api.v1+/design.type.stroke.update.value'
import { type IEntity } from '#app/schema/entity'
import { StrokeBasisTypeEnum, StrokeStyleTypeEnum } from '#app/schema/stroke'
import { SidebarPanelRowValuesContainer } from '..'
import { PanelEntityPopover } from './dashboard-entity-panel.popover'

interface EntityProps {
	entity: IEntity
}

const EntityPopover = memo(({ entity }: EntityProps) => {
	// display color on popover trigger if stroke is defined and solid
	const { stroke } = entity as IDesignWithStroke
	const { basis, value } = stroke
	const displayColor =
		basis === StrokeBasisTypeEnum.DEFINED && StrokeStyleTypeEnum.SOLID
	const backgroundColor = displayColor ? value : undefined

	return (
		<PanelEntityPopover name="Stroke" backgroundColor={backgroundColor}>
			<SidebarPanelPopoverFormContainer>
				<span>Value</span>
				<DesignTypeStrokeValue
					design={entity as IDesignWithStroke}
					formLocation="popover"
				/>
			</SidebarPanelPopoverFormContainer>
			<SidebarPanelPopoverFormContainer>
				<span>Basis</span>
				<DesignTypeStrokeBasis
					design={entity as IDesignWithStroke}
					formLocation="popover"
				/>
			</SidebarPanelPopoverFormContainer>
			<SidebarPanelPopoverFormContainer>
				<span>Style</span>
				<DesignTypeStrokeStyle
					design={entity as IDesignWithStroke}
					formLocation="popover"
				/>
			</SidebarPanelPopoverFormContainer>
		</PanelEntityPopover>
	)
})
EntityPopover.displayName = 'EntityPopover'

const EntityMainForm = memo(({ entity }: EntityProps) => {
	const { stroke } = entity as IDesignWithStroke
	const { basis } = stroke

	if (basis !== StrokeBasisTypeEnum.DEFINED) {
		return <DesignTypeStrokeBasis design={entity as IDesignWithStroke} />
	}

	return <DesignTypeStrokeValue design={entity as IDesignWithStroke} />
})
EntityMainForm.displayName = 'EntityMainForm'

export const PanelEntityValuesDesignStroke = ({
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
