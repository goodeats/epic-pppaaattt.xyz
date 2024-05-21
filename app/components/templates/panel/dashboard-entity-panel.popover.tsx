import {
	SidebarPanelPopoverFormsContainer,
	SidebarPanelPopoverHeader,
} from '#app/components/layout/popover'
import {
	SidebarPanelPopover,
	SidebarPanelPopoverContent,
	SidebarPanelPopoverTrigger,
} from '..'

export const PanelEntityPopover = ({
	name,
	backgroundColor,
	children,
}: {
	name: string
	backgroundColor?: string
	children: React.ReactNode
}) => {
	return (
		<SidebarPanelPopover>
			<SidebarPanelPopoverTrigger
				iconText={`${name} settings`}
				backgroundColor={backgroundColor}
			/>
			<SidebarPanelPopoverContent>
				<SidebarPanelPopoverHeader name={name} />
				<SidebarPanelPopoverFormsContainer>
					{children}
				</SidebarPanelPopoverFormsContainer>
			</SidebarPanelPopoverContent>
		</SidebarPanelPopover>
	)
}
