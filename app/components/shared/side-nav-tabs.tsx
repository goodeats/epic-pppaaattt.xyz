import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'

const SideNavTabsWrapper = ({
	children,
	defaultValue,
}: {
	children: React.ReactNode
	defaultValue: string
}) => {
	return (
		<Tabs defaultValue={defaultValue}>
			<div className="container h-full px-2">
				<div className="grid h-full items-stretch gap-6">
					<div className="hidden flex-col space-y-4 sm:flex md:order-2">
						{children}
					</div>
				</div>
			</div>
		</Tabs>
	)
}

const SideNavTabsList = ({
	cols,
	children,
}: {
	cols: number
	children: React.ReactNode
}) => {
	return (
		<TabsList className={`grid grid-cols-${cols} border-b-2 pb-4`}>
			{children}
		</TabsList>
	)
}

const SideNavTabsTrigger = ({
	children,
	value,
}: {
	children: string
	value: string
}) => {
	return (
		<TabsTrigger value={value} className="data-[state=active]:bg-muted">
			{children}
		</TabsTrigger>
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

const SideNavTabContentPanel = ({
	children,
}: {
	children: React.ReactNode
}) => {
	return (
		<div className="absolute h-full w-64 overflow-y-scroll">
			<div className="border-4 border-red-300">{children}</div>
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

export {
	SideNavTabsWrapper,
	SideNavTabsList,
	SideNavTabsTrigger,
	SideNavTabContent,
	SideNavTabContentPanel,
	SideNavTabText,
}
