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
import { type ILayout } from '#app/models/layout.server'
import { PanelFormDesignLayoutEditColumns } from '../../forms/design/panel-form-design-layout-edit-columns'
import { PanelFormDesignLayoutEditRows } from '../../forms/design/panel-form-design-layout-edit-rows'
import { PanelFormDesignLayoutEditStyle } from '../../forms/design/panel-form-design-layout-edit-style'

export const PanelPopoverDesignLayout = ({ layout }: { layout: ILayout }) => {
	return (
		<SidebarPanelPopover>
			<SidebarPanelPopoverTrigger>
				<Icon name="gear">
					<span className="sr-only">Layout Settings</span>
				</Icon>
			</SidebarPanelPopoverTrigger>
			<SidebarPanelPopoverContent>
				<SidebarPanelPopoverHeader
					title="Layout"
					description="Settings for this layout!"
				/>
				{/* forms */}
				<SidebarPanelPopoverFormsContainer>
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
				</SidebarPanelPopoverFormsContainer>
			</SidebarPanelPopoverContent>
		</SidebarPanelPopover>
	)
}
