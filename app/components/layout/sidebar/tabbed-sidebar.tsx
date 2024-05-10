import { capitalize } from '#app/utils/string-formatting'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs'

// - place this inside a Sidebar component

const TabbedSidebar = ({
	defaultValue,
	children,
}: {
	defaultValue: string
	children: React.ReactNode
}) => {
	// - absolute with overflow hidden to fit inside Sidebar
	// - full width and height
	// - flex column layout: flex-col
	const className = 'absolute w-full h-full flex flex-col overflow-hidden px-0'

	return (
		<Tabs defaultValue={defaultValue} className={className}>
			{children}
		</Tabs>
	)
}

const TabbedSidebarList = ({
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

const TabbedSidebarTrigger = ({ value }: { value: string }) => {
	// keep muted bg when active
	// only trigger text color will change
	const className = 'data-[state=active]:bg-muted'

	return (
		<TabsTrigger value={value} className={className}>
			{capitalize(value)}
		</TabsTrigger>
	)
}

const TabbedSidebarContent = ({
	value,
	children,
}: {
	value: string
	children: React.ReactNode
}) => {
	// flex full remaining height
	// overflow-y scroll
	const className = 'overflow-y-scroll flex-1 pb-4'

	return (
		<TabsContent value={value} className={className}>
			{children}
		</TabsContent>
	)
}

export {
	TabbedSidebar,
	TabbedSidebarList,
	TabbedSidebarTrigger,
	TabbedSidebarContent,
}
