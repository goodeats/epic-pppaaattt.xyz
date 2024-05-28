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
	lineFormatIconTooltip,
	lineBasisIconTooltip,
} from '#app/schema/line'
import { SidebarPanelRowValuesContainer } from '..'
import { TooltipForContent } from '../tooltip'
import { PanelEntityIcon } from './dashboard-entity-panel.icons'
import { PanelEntityPopover } from './dashboard-entity-panel.popover'

interface EntityProps {
	entity: IEntity
}

const EntityPopover = memo(({ entity }: EntityProps) => {
	return (
		<PanelEntityPopover name="Line">
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
		</PanelEntityPopover>
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
	const tooltipText = lineFormatIconTooltip(format as lineFormatTypeEnum)

	return (
		<TooltipForContent tooltipText={tooltipText}>
			<PanelEntityIcon symbol={symbol} text={`Line format: ${format}`} />
		</TooltipForContent>
	)
})
EntityFormatIcon.displayName = 'EntityFormatIcon'

const EntityBasisIcon = memo(({ entity }: EntityProps) => {
	const { line } = entity as IDesignWithLine
	const { format, basis } = line

	if (format === LineFormatTypeEnum.PIXEL) return null
	const icon = lineBasisIcon(basis as lineBasisTypeEnum) as IconName
	const tooltipText = lineBasisIconTooltip(basis as lineBasisTypeEnum)

	return (
		<TooltipForContent tooltipText={tooltipText}>
			<PanelEntityIcon icon={icon} text={`Line basis: ${basis}`} />
		</TooltipForContent>
	)
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
