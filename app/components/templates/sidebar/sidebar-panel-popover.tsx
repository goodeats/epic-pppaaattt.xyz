import { type Ref, forwardRef } from 'react'
import { SidebarPanelPopoverContentGrid } from '#app/components/layout/popover'
import { PanelIconButton } from '../../ui/panel-icon-button'
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover'

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

export {
	SidebarPanelPopover,
	SidebarPanelPopoverTrigger,
	SidebarPanelPopoverContent,
}
