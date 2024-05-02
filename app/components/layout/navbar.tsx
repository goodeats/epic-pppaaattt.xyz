import { createContainerComponent } from './utils'

// copied from v0.dev
// container for group of buttons
// - box-content so that border and padding is added on top of specified height and width
// specified height, width will depend on how many buttons
// gap-2 for separation between buttons
// rounded-md for rounded corners
// border and background color
const NavbarButtonGroup = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName:
		'box-content flex h-6 items-center gap-2 rounded-md border border-primary bg-primary-foreground p-1',
	displayName: 'NavbarButtonGroup',
})

export { NavbarButtonGroup }
