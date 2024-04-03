import {
	TabbedSidebarContainer,
	TabbedSidebarTabs,
	TabbedSidebarTabsContent,
	TabbedSidebarTabsList,
	TabbedSidebarTabsTrigger,
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
		<TabbedSidebarContainer>
			<TabbedSidebarTabs defaultValue={defaultTab}>
				{/* tab triggers */}
				<TabbedSidebarTabsList cols={tabs.length}>
					{tabs.map(tab => (
						<TabbedSidebarTabsTrigger key={tab} value={tab} />
					))}
				</TabbedSidebarTabsList>
				{/* content */}
				{children}
			</TabbedSidebarTabs>
		</TabbedSidebarContainer>
	)
}

const SidebarTabsContent = ({
	value,
	children,
}: {
	value: string
	children: React.ReactNode
}) => {
	return (
		<TabbedSidebarTabsContent value={value}>
			{children}
		</TabbedSidebarTabsContent>
	)
}

export { SidebarTabs, SidebarTabsContent }
