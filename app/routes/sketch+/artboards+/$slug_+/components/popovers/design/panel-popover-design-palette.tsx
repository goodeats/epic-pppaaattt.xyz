import {
	SidebarPanelPopover,
	SidebarPanelPopoverContent,
	SidebarPanelPopoverFormContainer,
	SidebarPanelPopoverFormsContainer,
	SidebarPanelPopoverHeader,
	SidebarPanelPopoverTrigger,
} from '#app/components/templates'
import { Icon } from '#app/components/ui/icon'
import { Input } from '#app/components/ui/input'
import { Label } from '#app/components/ui/label'
import { type IPalette } from '#app/models/palette.server'

export const PanelPopoverDesignPalette = ({
	palette,
}: {
	palette: IPalette
}) => {
	return (
		<SidebarPanelPopover>
			<SidebarPanelPopoverTrigger backgroundColor={palette.value}>
				<Icon name="gear">
					<span className="sr-only">Palette Settings</span>
				</Icon>
			</SidebarPanelPopoverTrigger>
			<SidebarPanelPopoverContent>
				<SidebarPanelPopoverHeader
					title="Palette"
					description="Settings for this palette!"
				/>
				{/* forms */}
				<SidebarPanelPopoverFormsContainer>
					{/* hex */}
					<SidebarPanelPopoverFormContainer>
						<Label htmlFor="value">Hexcode</Label>
						<Input
							id="value"
							defaultValue={palette.value}
							className="col-span-2 h-8"
							disabled
						/>
					</SidebarPanelPopoverFormContainer>
				</SidebarPanelPopoverFormsContainer>
			</SidebarPanelPopoverContent>
		</SidebarPanelPopover>
	)
}
