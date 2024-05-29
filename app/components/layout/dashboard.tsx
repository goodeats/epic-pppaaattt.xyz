import { createContainerComponent } from './utils'

// - full width and height: stretch to edges of parent container
// - flex column layout: flex-col
// - hide overflow
const Dashboard = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName: 'flex h-full w-full flex-col overflow-hidden p-0',
	displayName: 'Dashboard',
})

// - default tag name: header
// - space content evenly: justify-between
const DashboardHeader = createContainerComponent({
	defaultTagName: 'header',
	defaultClassName:
		'p-8 flex items-start justify-between space-y-2 border-b-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16',
	displayName: 'DashboardHeader',
})

// - default tag name: h1
// - nothing fancy, just a title
const DashboardTitle = createContainerComponent({
	defaultTagName: 'h1',
	defaultClassName: 'text-lg font-semibold tracking-tight',
	displayName: 'DashboardTitle',
})

// - default tag name: nav
// - margin left auto to push content to the right in flex layout
const DashboardNav = createContainerComponent({
	defaultTagName: 'nav',
	defaultClassName: 'ml-auto flex w-full items-center space-x-4 sm:justify-end',
	displayName: 'DashboardNav',
})

// - <main> to include sidebars since they are important for the layout and ux
const DashboardBody = createContainerComponent({
	defaultTagName: 'main',
	defaultClassName: 'relative flex flex-1',
	displayName: 'DashboardBody',
})

// - for displaying content along sidebars
const DashboardContent = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName: 'relative flex-1',
	displayName: 'DashboardContent',
})

// - absolute wrapper prevents scroll with sidebar
const DashboardContentWrapper = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName:
		'absolute inset-0 flex h-full w-full flex-col overflow-hidden',
	displayName: 'DashboardContentWrapper',
})

// - scrollable container inside the content wrapper
const DashboardContentContainer = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName: 'flex-1 overflow-y-scroll pb-12',
	displayName: 'DashboardContentContainer',
})

const DashboardContentHeading1 = createContainerComponent({
	defaultTagName: 'h1',
	defaultClassName: 'mb-2 pt-12 text-h1 lg:mb-6',
	displayName: 'DashboardContentHeading1',
})

const DashboardContentHeading2 = createContainerComponent({
	defaultTagName: 'h2',
	defaultClassName: 'mb-2 pt-12 text-h2 lg:mb-6',
	displayName: 'DashboardContentHeading2',
})

export {
	Dashboard,
	DashboardHeader,
	DashboardTitle,
	DashboardNav,
	DashboardBody,
	DashboardContent,
	DashboardContentWrapper,
	DashboardContentContainer,
	DashboardContentHeading1,
	DashboardContentHeading2,
}
