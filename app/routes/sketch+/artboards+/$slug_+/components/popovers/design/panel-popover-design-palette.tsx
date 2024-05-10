import { SidebarPanelPopoverFormContainer } from '#app/components/layout/popover'
import { Input } from '#app/components/ui/input'
import { Label } from '#app/components/ui/label'
import { type IPalette } from '#app/models/palette.server'
import { DesignTypeEnum } from '#app/schema/design'
import { PanelPopover } from '../panel-popover'

export const PanelPopoverDesignPalette = ({
	palette,
}: {
	palette: IPalette
}) => {
	return (
		<PanelPopover name={DesignTypeEnum.PALETTE} backgroundColor={palette.value}>
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
		</PanelPopover>
	)
}
