import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '#app/components/ui/tooltip'

// tooltip button, for example, needs to wait for hydration to avoid SSR issues
// before hydration, render the button without the tooltip
// after hydration, render the button with the tooltip

export const TooltipHydrated = ({
	tooltipText,
	isHydrated,
	children,
}: {
	tooltipText: string
	isHydrated: boolean
	children: JSX.Element
}) => {
	if (!isHydrated) return children

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent>{tooltipText}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
