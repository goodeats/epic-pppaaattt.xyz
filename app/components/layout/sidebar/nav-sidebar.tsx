import { createContainerComponent } from '../utils'

// - absolute with overflow hidden to fit inside Sidebar
// - full width and height
// - flex column layout: flex-col
const NavSidebar = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName: 'absolute w-full h-full flex flex-col overflow-hidden px-0',
	displayName: 'NavSidebar',
})

// flex full remaining height
// overflow-y scroll
const NavSidebarContent = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName: 'overflow-y-scroll flex-1 pb-4',
	displayName: 'NavSidebarContent',
})

export { NavSidebar, NavSidebarContent }
