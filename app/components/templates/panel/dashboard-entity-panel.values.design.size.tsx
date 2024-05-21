import { memo, useCallback } from 'react'
import { SidebarPanelPopoverFormContainer } from '#app/components/layout/popover'
import { type IconName } from '#app/components/ui/icon'
import { type IDesignWithSize } from '#app/models/design/design.server'
import { DesignTypeSizeBasis } from '#app/routes/resources+/api.v1+/design.type.size.update.basis'
import { DesignTypeSizeFormat } from '#app/routes/resources+/api.v1+/design.type.size.update.format'
import { DesignTypeSizeValue } from '#app/routes/resources+/api.v1+/design.type.size.update.value'
import { type IEntity } from '#app/schema/entity'
import {
	SizeFormatTypeEnum,
	sizeBasisIcon,
	type sizeBasisTypeEnum,
	sizeFormatIcon,
	type sizeFormatTypeEnum,
} from '#app/schema/size'
import { SidebarPanelRowValuesContainer } from '..'
import { PanelEntityIcon } from './dashboard-entity-panel.icons'
import { PanelEntityPopover } from './dashboard-entity-panel.popover'

interface EntityProps {
	entity: IEntity
}

const EntityPopover = memo(({ entity }: EntityProps) => {
	return (
		<PanelEntityPopover name="Size">
			<SidebarPanelPopoverFormContainer>
				<span>Value</span>
				<DesignTypeSizeValue
					design={entity as IDesignWithSize}
					formLocation="popover"
				/>
			</SidebarPanelPopoverFormContainer>
			<SidebarPanelPopoverFormContainer>
				<span>Basis</span>
				<DesignTypeSizeBasis
					design={entity as IDesignWithSize}
					formLocation="popover"
				/>
			</SidebarPanelPopoverFormContainer>
			<SidebarPanelPopoverFormContainer>
				<span>Format</span>
				<DesignTypeSizeFormat
					design={entity as IDesignWithSize}
					formLocation="popover"
				/>
			</SidebarPanelPopoverFormContainer>
		</PanelEntityPopover>
	)
})
EntityPopover.displayName = 'EntityPopover'

const EntityMainForm = memo(({ entity }: EntityProps) => {
	return <DesignTypeSizeValue design={entity as IDesignWithSize} />
})
EntityMainForm.displayName = 'EntityMainForm'

const EntityFormatIcon = memo(({ entity }: EntityProps) => {
	const { size } = entity as IDesignWithSize
	const { format } = size

	const symbol = sizeFormatIcon(format as sizeFormatTypeEnum)

	return <PanelEntityIcon symbol={symbol} text={`Size format: ${format}`} />
})
EntityFormatIcon.displayName = 'EntityFormatIcon'

const EntityBasisIcon = memo(({ entity }: EntityProps) => {
	const { size } = entity as IDesignWithSize
	const { format, basis } = size

	if (format === SizeFormatTypeEnum.PIXEL) return undefined
	const icon = sizeBasisIcon(basis as sizeBasisTypeEnum) as IconName

	return <PanelEntityIcon icon={icon} text={`Line basis: ${basis}`} />
})
EntityBasisIcon.displayName = 'EntityBasisIcon'

export const PanelEntityValuesDesignSize = ({
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

	const entityFormatIcon = useCallback(
		() => <EntityFormatIcon entity={entity} />,
		[entity],
	)

	const entityBasisIcon = useCallback(
		() => <EntityBasisIcon entity={entity} />,
		[entity],
	)

	return (
		<SidebarPanelRowValuesContainer>
			{entityPopover()}
			{entityMainForm()}
			{entityFormatIcon()}
			{entityBasisIcon()}
		</SidebarPanelRowValuesContainer>
	)
}
