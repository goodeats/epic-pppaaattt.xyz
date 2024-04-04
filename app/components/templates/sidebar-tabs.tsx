import {
	TabbedSidebar,
	TabbedSidebarContent,
	TabbedSidebarList,
	TabbedSidebarTrigger,
} from '../layout'

const SidebarTabs = ({
	tabs,
	defaultValue,
	children,
}: {
	tabs: string[]
	defaultValue?: string
	children: React.ReactNode
}) => {
	const defaultTab = defaultValue || tabs[0]

	return (
		<TabbedSidebar defaultValue={defaultTab}>
			{/* tab triggers */}
			<TabbedSidebarList cols={tabs.length}>
				{tabs.map(tab => (
					<TabbedSidebarTrigger key={tab} value={tab} />
				))}
			</TabbedSidebarList>
			{/* content */}
			{children}
		</TabbedSidebar>
	)
}

const SidebarTabsContent = ({
	value,
	children,
}: {
	value: string
	children: React.ReactNode
}) => {
	return <TabbedSidebarContent value={value}>{children}</TabbedSidebarContent>
}

export { SidebarTabs, SidebarTabsContent }
