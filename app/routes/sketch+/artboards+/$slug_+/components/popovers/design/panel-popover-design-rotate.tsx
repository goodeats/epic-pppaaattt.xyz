import { SidebarPanelPopoverFormContainer } from '#app/components/templates'
import { Input } from '#app/components/ui/input'
import { Label } from '#app/components/ui/label'
import { type IRotate } from '#app/models/rotate.server'
import { DesignTypeEnum } from '#app/schema/design'
import { PanelFormDesignRotateEditBasis } from '../../forms/design/panel-form-design-rotate-edit-basis'
import { PanelPopover } from '../panel-popover'

export const PanelPopoverDesignRotate = ({ rotate }: { rotate: IRotate }) => {
	return (
		<PanelPopover name={DesignTypeEnum.ROTATE}>
			{/* value */}
			<SidebarPanelPopoverFormContainer>
				<Label htmlFor="value">Value</Label>
				<Input
					id="value"
					defaultValue={rotate.value}
					className="col-span-2 h-8"
					disabled
				/>
			</SidebarPanelPopoverFormContainer>
			{/* basis */}
			<SidebarPanelPopoverFormContainer>
				<Label htmlFor="basis">Basis</Label>
				<PanelFormDesignRotateEditBasis rotate={rotate} />
			</SidebarPanelPopoverFormContainer>
		</PanelPopover>
	)
}
