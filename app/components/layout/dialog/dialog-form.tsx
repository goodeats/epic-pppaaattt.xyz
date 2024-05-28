import { createContainerComponent } from '../utils'

const DialogContentGrid = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName: 'grid gap-4 py-4',
	displayName: 'DialogContentGrid',
})

const DialogFormsContainer = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName: 'grid gap-2',
	displayName: 'DialogFormsContainer',
})

export { DialogContentGrid, DialogFormsContainer }
