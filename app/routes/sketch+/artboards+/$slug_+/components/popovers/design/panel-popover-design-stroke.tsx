import { SidebarPanelPopoverFormContainer } from '#app/components/layout/popover'
import { Input } from '#app/components/ui/input'
import { Label } from '#app/components/ui/label'
import { type IStroke } from '#app/models/stroke.server'
import { DesignTypeEnum } from '#app/schema/design'
import { StrokeBasisTypeEnum } from '#app/schema/stroke'
import { PanelFormDesignStrokeEditBasis } from '../../forms/design/panel-form-design-stroke-edit-basis'
import { PanelFormDesignStrokeEditStyle } from '../../forms/design/panel-form-design-stroke-edit-style'
import { PanelPopover } from '../panel-popover'

export const PanelPopoverDesignStroke = ({ stroke }: { stroke: IStroke }) => {
	const displayColor = stroke.basis === StrokeBasisTypeEnum.DEFINED

	return (
		<PanelPopover
			name={DesignTypeEnum.STROKE}
			backgroundColor={displayColor ? stroke.value : ''}
		>
			<SidebarPanelPopoverFormContainer>
				{/* style */}
				<Label htmlFor="style">Style</Label>
				<PanelFormDesignStrokeEditStyle stroke={stroke} />
			</SidebarPanelPopoverFormContainer>
			{/* value */}
			<SidebarPanelPopoverFormContainer>
				<Label htmlFor="value">Value</Label>
				<Input
					id="value"
					defaultValue={stroke.value}
					className="col-span-2 h-8"
					disabled
				/>
			</SidebarPanelPopoverFormContainer>
			{/* basis */}
			<SidebarPanelPopoverFormContainer>
				<Label htmlFor="basis">Basis</Label>
				<PanelFormDesignStrokeEditBasis stroke={stroke} />
			</SidebarPanelPopoverFormContainer>
		</PanelPopover>
	)
}
