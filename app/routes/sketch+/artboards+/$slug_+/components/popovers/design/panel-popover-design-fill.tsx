import { SidebarPanelPopoverFormContainer } from '#app/components/templates'
import { Input } from '#app/components/ui/input'
import { Label } from '#app/components/ui/label'
import { type IFill } from '#app/models/fill.server'
import { DesignTypeEnum } from '#app/schema/design'
import { FillBasisTypeEnum, FillStyleTypeEnum } from '#app/schema/fill'
import { PanelFormDesignFillEditBasis } from '../../forms/design/panel-form-design-fill-edit-basis'
import { PanelFormDesignFillEditStyle } from '../../forms/design/panel-form-design-fill-edit-style'
import { PanelPopover } from '../panel-popover'

export const PanelPopoverDesignFill = ({ fill }: { fill: IFill }) => {
	const displayColor =
		fill.basis === FillBasisTypeEnum.DEFINED && FillStyleTypeEnum.SOLID

	return (
		<PanelPopover
			name={DesignTypeEnum.FILL}
			backgroundColor={displayColor ? fill.value : ''}
		>
			{/* style */}
			<SidebarPanelPopoverFormContainer>
				<Label htmlFor="style">Style</Label>
				<PanelFormDesignFillEditStyle fill={fill} />
			</SidebarPanelPopoverFormContainer>
			{/* value */}
			<SidebarPanelPopoverFormContainer>
				<Label htmlFor="value">Value</Label>
				<Input
					id="value"
					defaultValue={fill.value}
					className="col-span-2 h-8"
					disabled
				/>
			</SidebarPanelPopoverFormContainer>
			{/* basis */}
			<SidebarPanelPopoverFormContainer>
				<Label htmlFor="basis">Basis</Label>
				<PanelFormDesignFillEditBasis fill={fill} />
			</SidebarPanelPopoverFormContainer>
		</PanelPopover>
	)
}
