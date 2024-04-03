import { SidebarPanelPopoverFormContainer } from '#app/components/templates'
import { Input } from '#app/components/ui/input'
import { Label } from '#app/components/ui/label'
import { type ISize } from '#app/models/size.server'
import { DesignTypeEnum } from '#app/schema/design'
import { PanelFormDesignSizeEditBasis } from '../../forms/design/panel-form-design-size-edit-basis'
import { PanelFormDesignSizeEditFormat } from '../../forms/design/panel-form-design-size-edit-format'
import { PanelPopover } from '../panel-popover'

export const PanelPopoverDesignSize = ({ size }: { size: ISize }) => {
	return (
		<PanelPopover name={DesignTypeEnum.SIZE}>
			{/* format */}
			<SidebarPanelPopoverFormContainer>
				<Label htmlFor="style">Format</Label>
				<PanelFormDesignSizeEditFormat size={size} />
			</SidebarPanelPopoverFormContainer>
			{/* value */}
			<SidebarPanelPopoverFormContainer>
				<Label htmlFor="value">Value</Label>
				<Input
					id="value"
					defaultValue={size.value}
					className="col-span-2 h-8"
					disabled
				/>
			</SidebarPanelPopoverFormContainer>
			{/* basis */}
			<SidebarPanelPopoverFormContainer>
				<Label htmlFor="style">Basis</Label>
				<PanelFormDesignSizeEditBasis size={size} />
			</SidebarPanelPopoverFormContainer>
		</PanelPopover>
	)
}
