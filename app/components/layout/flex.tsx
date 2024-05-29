import { createContainerComponent } from './utils'

const FlexColumn = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName: 'flex flex-col overflow-hidden',
	displayName: 'FlexColumn',
})

const FlexRow = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName: 'flex flex-row overflow-hidden',
	displayName: 'FlexRow',
})

export { FlexColumn, FlexRow }
