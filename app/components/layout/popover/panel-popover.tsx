import { capitalize } from '#app/utils/string-formatting'
import { createContainerComponent } from '../utils'

const SidebarPanelPopoverContentGrid = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName: 'grid gap-4',
	displayName: 'SidebarPanelPopoverContentGrid',
})

const SidebarPanelPopoverHeader = ({
	name,
	description,
}: {
	name: string
	description?: string
}) => {
	const popoverTitle = capitalize(name)
	const popoverDescription = description || `Settings for this ${name}!`

	const SidebarPanelPopoverTitle = createContainerComponent({
		defaultTagName: 'h4',
		defaultClassName: 'font-medium leading-none',
		displayName: 'SidebarPanelPopoverTitle',
	})

	const SidebarPanelPopoverDescription = createContainerComponent({
		defaultTagName: 'p',
		defaultClassName: 'text-sm text-muted-foreground',
		displayName: 'SidebarPanelPopoverDescription',
	})

	return (
		<div className="space-y-2">
			<SidebarPanelPopoverTitle>{popoverTitle}</SidebarPanelPopoverTitle>
			<SidebarPanelPopoverDescription>
				{popoverDescription}
			</SidebarPanelPopoverDescription>
		</div>
	)
}

const SidebarPanelPopoverFormsContainer = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName: 'grid gap-2',
	displayName: 'SidebarPanelPopoverFormsContainer',
})

const SidebarPanelPopoverFormContainer = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName: 'grid grid-cols-3 items-center gap-4',
	displayName: 'SidebarPanelPopoverFormContainer',
})

export {
	SidebarPanelPopoverContentGrid,
	SidebarPanelPopoverHeader,
	SidebarPanelPopoverFormsContainer,
	SidebarPanelPopoverFormContainer,
}
