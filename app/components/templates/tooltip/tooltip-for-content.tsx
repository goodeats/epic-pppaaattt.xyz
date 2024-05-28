import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '#app/components/ui/tooltip'

// use only for content that is not interactive
// like a button or link
// for buttons or links, use TooltipHydrated

export const TooltipForContent = ({
	tooltipText,
	children,
}: {
	tooltipText: string
	children: JSX.Element
}) => {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>{children}</TooltipTrigger>
				<TooltipContent>{tooltipText}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
