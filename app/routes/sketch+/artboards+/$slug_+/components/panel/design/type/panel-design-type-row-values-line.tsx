import { SidebarPanelRowValuesContainer } from '#app/components/templates'
import { Icon } from '#app/components/ui/icon'
import { type ILine } from '#app/models/line.server'
import {
	LineFormatTypeEnum,
	lineBasisIcon,
	type lineBasisTypeEnum,
	lineFormatIcon,
	type lineFormatTypeEnum,
} from '#app/schema/line'
import { PanelFormDesignLineEditWidth } from '../../../forms/design/panel-form-design-line=edit-width'
import { PanelPopoverDesignLine } from '../../../popovers/design/panel-popover-design-line'

export const PanelDesignTypeRowValuesLine = ({ line }: { line: ILine }) => {
	const LineFormatIcon = () => {
		const icon = lineFormatIcon(line.format as lineFormatTypeEnum)
		return (
			<div className="m-2 mr-0 flex h-8 w-8 items-center justify-center">
				<span className="text-body-xs leading-none">{icon}</span>
			</div>
		)
	}

	const LineBasisIcon = () => {
		if (line.format === LineFormatTypeEnum.PIXEL) return null

		const icon = lineBasisIcon(line.basis as lineBasisTypeEnum)
		return (
			<div className="m-2 mr-0 flex h-8 w-8 items-center justify-center">
				<Icon name={icon}>
					<span className="sr-only">Line Basis: {line.basis}</span>
				</Icon>
			</div>
		)
	}

	return (
		<SidebarPanelRowValuesContainer>
			<PanelPopoverDesignLine line={line} />
			<PanelFormDesignLineEditWidth line={line} />
			<LineFormatIcon />
			<LineBasisIcon />
		</SidebarPanelRowValuesContainer>
	)
}
