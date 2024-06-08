import { createContainerComponent } from '../utils'

const ImageSidebar = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName:
		'relative flex-1 flex w-full flex-col overflow-y-scroll p-4 gap-4 ',
	displayName: 'ImageSidebar',
})

export { ImageSidebar }
