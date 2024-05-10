import { SidebarPanelPopoverFormContainer } from '#app/components/layout/popover'
import { Input } from '#app/components/ui/input'
import { Label } from '#app/components/ui/label'
import { type ILine } from '#app/models/design-type/line/line.server'
import { DesignTypeEnum } from '#app/schema/design'
import { PanelFormDesignLineEditBasis } from '../../forms/design/panel-form-design-line-edit-basis'
import { PanelFormDesignLineEditFormat } from '../../forms/design/panel-form-design-line-edit-format'
import { PanelPopover } from '../panel-popover'

export const PanelPopoverDesignLine = ({ line }: { line: ILine }) => {
	return (
		<PanelPopover name={DesignTypeEnum.LINE}>
			{/* width */}
			<SidebarPanelPopoverFormContainer>
				<Label htmlFor="width">Width</Label>
				<Input
					id="width"
					defaultValue={line.width}
					className="col-span-2 h-8"
					disabled
				/>
			</SidebarPanelPopoverFormContainer>
			{/* format */}
			<SidebarPanelPopoverFormContainer>
				<Label htmlFor="style">Format</Label>
				<PanelFormDesignLineEditFormat line={line} />
			</SidebarPanelPopoverFormContainer>
			{/* basis */}
			<SidebarPanelPopoverFormContainer>
				<Label htmlFor="style">Basis</Label>
				<PanelFormDesignLineEditBasis line={line} />
			</SidebarPanelPopoverFormContainer>
		</PanelPopover>
	)
}
