import { SidebarPanelPopoverFormContainer } from '#app/components/templates'
import { Input } from '#app/components/ui/input'
import { Label } from '#app/components/ui/label'
import { type ILayout } from '#app/models/layout.server'
import { DesignTypeEnum } from '#app/schema/design'
import { PanelFormDesignLayoutEditColumns } from '../../forms/design/panel-form-design-layout-edit-columns'
import { PanelFormDesignLayoutEditRows } from '../../forms/design/panel-form-design-layout-edit-rows'
import { PanelFormDesignLayoutEditStyle } from '../../forms/design/panel-form-design-layout-edit-style'
import { PanelPopover } from '../panel-popover'

export const PanelPopoverDesignLayout = ({ layout }: { layout: ILayout }) => {
	return (
		<PanelPopover name={DesignTypeEnum.LAYOUT}>
			{/* style */}
			<SidebarPanelPopoverFormContainer>
				<Label htmlFor="style">Style</Label>
				<PanelFormDesignLayoutEditStyle layout={layout} />
			</SidebarPanelPopoverFormContainer>
			{/* count */}
			<SidebarPanelPopoverFormContainer>
				<Label htmlFor="count">Count</Label>
				<Input
					id="count"
					defaultValue={layout.count}
					className="col-span-2 h-8"
					disabled
				/>
			</SidebarPanelPopoverFormContainer>
			{/* rows */}
			<SidebarPanelPopoverFormContainer>
				<Label htmlFor="rows">Rows</Label>
				<PanelFormDesignLayoutEditRows layout={layout} />
			</SidebarPanelPopoverFormContainer>
			{/* columns */}
			<SidebarPanelPopoverFormContainer>
				<Label htmlFor="columns">Columns</Label>
				<PanelFormDesignLayoutEditColumns layout={layout} />
			</SidebarPanelPopoverFormContainer>
		</PanelPopover>
	)
}
