import { createContainerComponent } from '../layout/utils'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

const SidebarPanelPopover = ({ children }: { children: React.ReactNode }) => {
	return <Popover>{children}</Popover>
}

const SidebarPanelPopoverTrigger = ({
	children,
}: {
	children: React.ReactNode
}) => {
	// square button with icon
	const className =
		'm-2 mr-0 flex h-8 w-8 cursor-pointer items-center justify-center'

	return (
		<PopoverTrigger asChild>
			<Button variant="ghost" size="sm" className={className}>
				{children}
			</Button>
		</PopoverTrigger>
	)
}

const SidebarPanelPopoverContent = ({
	children,
}: {
	children: React.ReactNode
}) => {
	// fixed width
	const className = 'w-80'

	return (
		<PopoverContent className={className}>
			<SidebarPanelPopoverContentGrid>
				{children}
			</SidebarPanelPopoverContentGrid>
		</PopoverContent>
	)
}

const SidebarPanelPopoverContentGrid = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName: 'grid gap-4',
	displayName: 'SidebarPanelPopoverContentGrid',
})

const SidebarPanelPopoverHeader = ({
	title,
	description,
}: {
	title: string
	description: string
}) => {
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
			<SidebarPanelPopoverTitle>{title}</SidebarPanelPopoverTitle>
			<SidebarPanelPopoverDescription>
				{description}
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
	SidebarPanelPopover,
	SidebarPanelPopoverTrigger,
	SidebarPanelPopoverContent,
	SidebarPanelPopoverContentGrid,
	SidebarPanelPopoverHeader,
	SidebarPanelPopoverFormsContainer,
	SidebarPanelPopoverFormContainer,
}
