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
	defaultClassName: 'overflow-y-scroll flex-1 py-4',
	displayName: 'NavSidebarContent',
})

// list of nav items
// - full width, no grid or flex necessary
// border and py to separate nav lists
const NavSidebarList = createContainerComponent({
	defaultTagName: 'ul',
	defaultClassName: 'w-full py-2',
	displayName: 'NavSidebarList',
})

// single list item
// - flex layout
// - full width
// - padding on x-axis
const NavSidebarListItem = createContainerComponent({
	defaultTagName: 'li',
	defaultClassName: 'flex flex-col w-full items-center px-2 mb-1',
	displayName: 'NavSidebarListItem',
})

// will exclude expand/collapse buttons (if any)
// flexes remaining width from them
// - fixed height: h-8
const NavSidebarListItemContainer = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName: 'flex h-8 flex-1 w-full items-center content-start',
	displayName: 'NavSidebarListItemContainer',
})

// inside li container
// flexes remaining width from actions (expand/collapse icon)
// no truncate title is long
const NavSidebarListItemLinkContainer = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName:
		'flex items-center flex-1 h-8 w-full self-center truncate pl-2',
	displayName: 'NavSidebarListItemLinkContainer',
})

// - line clamp to 1 line of text
const navSidebarLinkClassNameDefault =
	'line-clamp-2 flex-1 block py-2 text-base lg:text-xl  text-muted-foreground hover:bg-accent hover:text-accent-foreground'

const navSidebarLinkClassNameActive = 'bg-accent text-accent-foreground'

export {
	NavSidebar,
	NavSidebarContent,
	NavSidebarList,
	NavSidebarListItem,
	NavSidebarListItemContainer,
	NavSidebarListItemLinkContainer,
	navSidebarLinkClassNameDefault,
	navSidebarLinkClassNameActive,
}
