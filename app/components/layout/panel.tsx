import { createContainerComponent } from './utils'

// stylllllllllllllllle
// make move up/down buttons smaller
// give space on left, not just absolute?
// hover effects on icons
// fix popover infinite loop

// list of panel rows
// - grid layout since child components will be placed in a grid
// border and py to separate panels
const Panel = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName: 'grid w-full border-b-2 py-2',
	displayName: 'Panel',
})

// single panel row
// - grid layout since child components will be placed in a grid
// - fixed height: h-8
// - full width
// - 12 columns
// - padding on x-axis
const PanelRow = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName:
		'relative grid h-8 w-full grid-cols-12 grid-rows-1 items-center px-2',
	displayName: 'PanelRow',
})

// excludes move up/down buttons
// gives a little room for them
// starts at column 1 and ends at column 13
const PanelRowContainer = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName:
		'col-start-1 col-end-13 flex items-center justify-between gap-2',
	displayName: 'PanelRowContainer',
})

// start at beginning of row container
// no overlap with move up/down buttons
// no overflow on x-axis
const PanelTitleContainer = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName: 'col-start-1 h-8 w-full self-center overflow-x-hidden pl-2',
	displayName: 'PanelTitleContainer',
})

// class names might not be necessary
// TODO: change to a text
const PanelTitle = createContainerComponent({
	defaultTagName: 'span',
	defaultClassName: 'flex items-center',
	displayName: 'PanelTitle',
})

// container to move the panel up/down
// on left edge of panel row
// full height, half width
const PanelRowReorderContainer = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName:
		'l-0 t-0 absolute flex h-8 w-4 flex-col items-center justify-center',
	displayName: 'PanelRowReorderContainer',
})

// contains panel input forms
// and popover/dialog triggers
// and potentially other items
// max width of 36rem
// end at column 8 to give space for panel actions
const PanelRowValuesContainer = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName: 'col-end-8 flex max-w-36 items-center',
	displayName: 'PanelRowValuesContainer',
})

// similar to a <nav> for the panel, but no page navigation is occurring so just div
// flex shrink to not grow
const PanelRowActionsContainer = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName: 'flex flex-shrink-0 items-center',
	displayName: 'PanelRowActionsContainer',
})

export {
	Panel,
	PanelRow,
	PanelRowContainer,
	PanelTitleContainer,
	PanelTitle,
	PanelRowReorderContainer,
	PanelRowValuesContainer,
	PanelRowActionsContainer,
}
