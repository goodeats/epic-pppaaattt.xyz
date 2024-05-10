import { Icon, type IconName } from '#app/components/ui/icon'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '#app/components/ui/tooltip'

export const TooltipIcon = ({
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
					<Icon name={icon} className="scale-125 max-md:scale-150">
						<span className="sr-only">{text}</span>
					</Icon>
				</TooltipTrigger>
				<TooltipContent>{tooltipText}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
