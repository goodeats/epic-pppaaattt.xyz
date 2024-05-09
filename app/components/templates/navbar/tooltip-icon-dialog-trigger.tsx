import { DialogTrigger } from '#app/components/ui/dialog'
import { type IconName } from '#app/components/ui/icon'
import { PanelIconButton } from '#app/components/ui/panel-icon-button'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '#app/components/ui/tooltip'

export const TooltipIconDialogTrigger = ({
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
					<DialogTrigger asChild>
						<PanelIconButton iconName={icon} iconText={text} />
					</DialogTrigger>
				</TooltipTrigger>
				<TooltipContent>{tooltipText}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
