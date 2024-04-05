import { type Ref, forwardRef } from 'react'
import { capitalize } from '#app/utils/string-formatting'
import { createContainerComponent } from '../layout/utils'
import { PanelIconButton } from '../ui/panel-icon-button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

const SidebarPanelPopover = ({ children }: { children: React.ReactNode }) => {
	return <Popover>{children}</Popover>
}

const SidebarPanelPopoverTrigger = ({
	iconText,
	backgroundColor,
}: {
	iconText: string
	backgroundColor?: string
}) => {
	return (
		<PopoverTrigger asChild>
			<PanelIconButton
				iconName="gear"
				iconText={iconText}
				backgroundColor={backgroundColor}
			/>
		</PopoverTrigger>
	)
}

const SidebarPanelPopoverContentGrid = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName: 'grid gap-4',
	displayName: 'SidebarPanelPopoverContentGrid',
})

// forwardRef for popover content with forms
// prevent infinite loop
// https://www.radix-ui.com/primitives/docs/components/popover#custom-apis
// https://github.com/radix-ui/primitives/issues/2152#issuecomment-1956478879
const SidebarPanelPopoverContent = forwardRef<
	HTMLDivElement,
	{ children: React.ReactNode }
>(({ children, ...props }, forwardedRef: Ref<HTMLDivElement>) => {
	const className = 'w-80'

	return (
		<PopoverContent className={className} {...props} ref={forwardedRef}>
			<SidebarPanelPopoverContentGrid>
				{children}
			</SidebarPanelPopoverContentGrid>
		</PopoverContent>
	)
})
SidebarPanelPopoverContent.displayName = 'SidebarPanelPopoverContent'

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
	SidebarPanelPopover,
	SidebarPanelPopoverTrigger,
	SidebarPanelPopoverContent,
	SidebarPanelPopoverHeader,
	SidebarPanelPopoverFormsContainer,
	SidebarPanelPopoverFormContainer,
}
