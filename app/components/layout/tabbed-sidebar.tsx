import { capitalize } from '#app/utils/string-formatting'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { createContainerComponent } from './utils'

// - place this inside a Sidebar component
// - flex to full sidbar column height
// - full width: w-full
// - flex column layout: flex-col
const TabbedSidebarContainer = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName:
		'absolute w-full flex flex-1 flex-col border-4 border-green-500 bg-secondary',
	displayName: 'TabbedSidebarContainer',
})

const TabbedSidebarTabs = ({
	defaultValue,
	children,
}: {
	defaultValue: string
	children: React.ReactNode
}) => {
	const className = 'flex-1 flex flex-col px-0'
	return (
		<Tabs defaultValue={defaultValue} className={className}>
			{children}
		</Tabs>
	)
}

const TabbedSidebarTabsList = ({
	cols,
	children,
}: {
	cols: number
	children: React.ReactNode
}) => {
	// - grid layout with columns based on the number of tabs
	// - border bottom to separate from content
	// - padding bottom to separate from content
	const className = `grid grid-cols-${cols} border-b-2 pb-4`

	return <TabsList className={className}>{children}</TabsList>
}

const TabbedSidebarTabsTrigger = ({ value }: { value: string }) => {
	// muted when active
	const className = 'data-[state=active]:bg-muted'

	return (
		<TabsTrigger value={value} className={className}>
			{capitalize(value)}
		</TabsTrigger>
	)
}

const TabbedSidebarTabsContent = ({
	value,
	children,
}: {
	value: string
	children: React.ReactNode
}) => {
	const className =
		'relative bg-violet-400 border-4 border-yellow-500 overflow-y-scroll flex-1'

	const TabsContentWrapper = createContainerComponent({
		defaultTagName: 'div',
		defaultClassName: 'border-4 border-red-500',
		displayName: 'TabsContentWrapper',
	})

	return (
		<TabsContent value={value} className={className}>
			<TabsContentWrapper>{children}</TabsContentWrapper>
		</TabsContent>
	)
}

export {
	TabbedSidebarContainer,
	TabbedSidebarTabs,
	TabbedSidebarTabsList,
	TabbedSidebarTabsTrigger,
	TabbedSidebarTabsContent,
}
