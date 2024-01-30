import { HoverCardContent, HoverCardTrigger } from '../ui/hover-card'

const SideNavFormWrapper = ({ children }: { children: React.ReactNode }) => {
	return <div className="grid gap-2 pt-2">{children}</div>
}

const SideNavFormHoverTrigger = ({
	children,
}: {
	children: React.ReactNode
}) => {
	return (
		<HoverCardTrigger asChild>
			<div className="grid gap-4">
				<div className="flex items-center justify-between">{children}</div>
			</div>
		</HoverCardTrigger>
	)
}

const SideNavFormHoverContent = ({
	children,
}: {
	children: React.ReactNode
}) => {
	return (
		<HoverCardContent align="start" className="w-[260px] text-sm" side="left">
			{children}
		</HoverCardContent>
	)
}

export { SideNavFormWrapper, SideNavFormHoverTrigger, SideNavFormHoverContent }
