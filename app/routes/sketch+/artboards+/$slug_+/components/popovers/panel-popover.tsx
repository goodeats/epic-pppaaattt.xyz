import {
	SidebarPanelPopoverFormsContainer,
	SidebarPanelPopoverHeader,
} from '#app/components/layout/popover'
import {
	SidebarPanelPopover,
	SidebarPanelPopoverContent,
	SidebarPanelPopoverTrigger,
} from '#app/components/templates'

export const PanelPopover = ({
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
