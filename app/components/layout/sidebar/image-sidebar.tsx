import { createContainerComponent } from '../utils'

const ImageSidebar = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName:
		'relative flex-1 flex w-full flex-col overflow-y-scroll p-4 gap-4',
	displayName: 'ImageSidebar',
})

const ImageSidebarList = createContainerComponent({
	defaultTagName: 'ul',
	defaultClassName: 'flex flex-col gap-4 py-5',
	displayName: 'ImageSidebarList',
})

const ImageSidebarListItem = createContainerComponent({
	defaultTagName: 'li',
	defaultClassName: 'flex flex-col gap-4 px-2',
	displayName: 'ImageSidebarListItem',
})

export { ImageSidebar, ImageSidebarList, ImageSidebarListItem }
