import { createContainerComponent } from './utils'

// - default tag name: nav
// - fixed width: w-64
// - flex column layout: flex-col
// - vertical scrolling: overflow-y-scroll
const Sidebar = createContainerComponent({
	defaultTagName: 'nav',
	defaultClassName:
		'flex w-64 flex-col overflow-y-scroll border-4 border-blue-500 bg-muted',
	displayName: 'Sidebar',
})

export { Sidebar }
