import { type IconName } from '#app/components/ui/icon'
import { PanelIconButton } from '#app/components/ui/panel-icon-button'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '#app/components/ui/tooltip'

export const TooltipIconButton = ({
	icon,
	text,
	tooltipText,
}: {
	icon: IconName
	text: string
	tooltipText: string
}) => {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>
					<PanelIconButton iconName={icon} iconText={text} />
				</TooltipTrigger>
				<TooltipContent>{tooltipText}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
