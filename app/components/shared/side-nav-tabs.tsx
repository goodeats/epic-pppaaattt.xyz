import { Tabs } from '../ui/tabs'

const SideNavTabsWrapper = ({
	children,
	defaultValue,
}: {
	children: React.ReactNode
	defaultValue: string
}) => {
	return (
		<Tabs defaultValue={defaultValue} className="flex-1">
			<div className="container h-full py-6">
				<div className="grid h-full items-stretch gap-6">
					<div className="hidden flex-col space-y-4 sm:flex md:order-2">
						{children}
					</div>
				</div>
			</div>
		</Tabs>
	)
}

const SideNavTabContent = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="grid h-full items-stretch gap-6">
			<div className="hidden flex-col space-y-4 sm:flex md:order-2">
				{children}
			</div>
		</div>
	)
}

const SideNavTabText = ({
	children,
}: {
	children: string | React.ReactNode
}) => {
	return <div className="text-sm text-muted-foreground">{children}</div>
}

export { SideNavTabsWrapper, SideNavTabContent, SideNavTabText }
