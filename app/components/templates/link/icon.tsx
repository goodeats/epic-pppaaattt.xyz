import { Link } from '@remix-run/react'
import { Button } from '#app/components/ui/button'
import { Icon, type IconName } from '#app/components/ui/icon'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '#app/components/ui/tooltip'

const IconLink = ({
	to,
	icon,
	text,
	tooltipText,
	buttonVariant,
}: {
	to: string
	icon: IconName
	text: string
	tooltipText: string
	buttonVariant?:
		| 'default'
		| 'link'
		| 'destructive'
		| 'outline'
		| 'secondary'
		| 'ghost'
		| null
		| undefined
}) => {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>
					<Button asChild size="icon" variant={buttonVariant}>
						<Link to={to} prefetch="intent">
							<Icon name={icon} className="scale-125 max-md:scale-150">
								<span className="sr-only">{text}</span>
							</Icon>
						</Link>
					</Button>
				</TooltipTrigger>
				<TooltipContent>{tooltipText}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}

export { IconLink }
