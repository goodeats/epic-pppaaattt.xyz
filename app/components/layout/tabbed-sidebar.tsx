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
		'absolute w-full flex h-full flex-col border-4 border-green-500',
	displayName: 'TabbedSidebarContainer',
})

const TabbedSidebarTabs = ({
	defaultValue,
	children,
}: {
	defaultValue: string
	children: React.ReactNode
}) => {
	const className = 'flex-1 flex flex-col overflow-hidden px-0'
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
	// - flex none to not grow
	// - grid layout with columns based on the number of tabs
	// - border bottom to separate from content
	const className = `flex-none grid grid-cols-${cols} border-b-2`

	return <TabsList className={className}>{children}</TabsList>
}

const TabbedSidebarTabsTrigger = ({ value }: { value: string }) => {
	// keep muted bg when active
	// only trigger text color will change
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
	// flex full remaining height
	// overflow-y scroll
	const className = 'border-4 border-yellow-500 overflow-y-scroll flex-1 mb-4'

	return (
		<TabsContent value={value} className={className}>
			{children}
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
