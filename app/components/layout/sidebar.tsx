import { createContainerComponent } from './utils'

// - default tag name: nav
// - fixed width: w-64
// - position relative to fit absolute content inside itself
// - flex column layout: flex-col
// - vertical scrolling: overflow-y-scroll
const Sidebar = createContainerComponent({
	defaultTagName: 'nav',
	defaultClassName: 'relative flex w-64 flex-col overflow-y-scroll bg-muted',
	displayName: 'Sidebar',
})

export { Sidebar }
