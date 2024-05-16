import { memo, useCallback } from 'react'
import { SidebarPanelPopoverFormContainer } from '#app/components/layout/popover'
import { type IconName } from '#app/components/ui/icon'
import { type IDesignWithLine } from '#app/models/design/design.server'
import { DesignTypeLineBasis } from '#app/routes/resources+/api.v1+/design.type.line.update.basis'
import { DesignTypeLineFormat } from '#app/routes/resources+/api.v1+/design.type.line.update.format'
import { DesignTypeLineWidth } from '#app/routes/resources+/api.v1+/design.type.line.update.width'
import { type IEntity } from '#app/schema/entity'
import {
	LineFormatTypeEnum,
	lineBasisIcon,
	type lineBasisTypeEnum,
	lineFormatIcon,
	type lineFormatTypeEnum,
} from '#app/schema/line'
import { SidebarPanelRowValuesContainer } from '..'
import { PanelEntityIconAlt } from './dashboard-entity-panel.icons'
import { PanelEntityPopoverAlt } from './dashboard-entity-panel.popover.alt'

interface EntityProps {
	entity: IEntity
}

const EntityPopover = memo(({ entity }: EntityProps) => {
	return (
		<PanelEntityPopoverAlt name="Line">
			<SidebarPanelPopoverFormContainer>
				<span>Width</span>
				<DesignTypeLineWidth
					design={entity as IDesignWithLine}
					formLocation="popover"
				/>
			</SidebarPanelPopoverFormContainer>
			<SidebarPanelPopoverFormContainer>
				<span>Basis</span>
				<DesignTypeLineBasis
					design={entity as IDesignWithLine}
					formLocation="popover"
				/>
			</SidebarPanelPopoverFormContainer>
			<SidebarPanelPopoverFormContainer>
				<span>Format</span>
				<DesignTypeLineFormat
					design={entity as IDesignWithLine}
					formLocation="popover"
				/>
			</SidebarPanelPopoverFormContainer>
		</PanelEntityPopoverAlt>
	)
})
EntityPopover.displayName = 'EntityPopover'

const EntityMainForm = memo(({ entity }: EntityProps) => {
	return <DesignTypeLineWidth design={entity as IDesignWithLine} />
})
EntityMainForm.displayName = 'EntityMainForm'

const EntityFormatIcon = memo(({ entity }: EntityProps) => {
	const { line } = entity as IDesignWithLine
	const { format } = line
	const symbol = lineFormatIcon(format as lineFormatTypeEnum)

	return <PanelEntityIconAlt symbol={symbol} text={`Line format: ${format}`} />
})
EntityFormatIcon.displayName = 'EntityFormatIcon'

const EntityBasisIcon = memo(({ entity }: EntityProps) => {
	const { line } = entity as IDesignWithLine
	const { format, basis } = line

	if (format === LineFormatTypeEnum.PIXEL) return null
	const icon = lineBasisIcon(basis as lineBasisTypeEnum) as IconName

	return <PanelEntityIconAlt icon={icon} text={`Line basis: ${basis}`} />
})
EntityBasisIcon.displayName = 'EntityBasisIcon'

export const PanelEntityValuesDesignLine = ({
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
