import { createContainerComponent } from './utils'

// list of panel rows
// - full width, no grid or flex necessary
// border and py to separate panels
const Panel = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName: 'w-full border-b-2 py-2',
	displayName: 'Panel',
})

// single panel row
// - flex layout
// - fixed height: h-8
// - full width
// - padding on x-axis
const PanelRow = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName: 'flex h-8 w-full items-center px-2',
	displayName: 'PanelRow',
})

// excludes move up/down buttons
// flexes remaining width from them
const PanelRowContainer = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName: 'flex flex-1 w-full items-center gap-2',
	displayName: 'PanelRowContainer',
})

// inside row container
// flexes remaining width from actions (new/plus icon)
// no overflow on x-axis if title is long
const PanelTitleContainer = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName:
		'flex items-center flex-1 h-8 w-full self-center overflow-x-hidden pl-2',
	displayName: 'PanelTitleContainer',
})

// title inside title container
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
	defaultClassName: 'flex h-8 w-4 flex-col items-center justify-center',
	displayName: 'PanelRowReorderContainer',
})

// contains panel input forms
// and popover/dialog triggers
// and potentially other items
// flexes full remaining width from actions
const PanelRowValuesContainer = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName: 'flex flex-1 items-center',
	displayName: 'PanelRowValuesContainer',
})

// similar to a <nav> for the panel,
// but no page navigation is occurring so just div
// flex shrink to let values take up remaining space
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
