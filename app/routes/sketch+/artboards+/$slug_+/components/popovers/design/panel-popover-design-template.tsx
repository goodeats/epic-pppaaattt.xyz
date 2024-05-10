import { SidebarPanelPopoverFormContainer } from '#app/components/layout/popover'
import { Label } from '#app/components/ui/label'
import { type ITemplate } from '#app/models/template.server'
import { DesignTypeEnum } from '#app/schema/design'
import { PanelFormDesignTemplateEditStyle } from '../../forms/design/panel-form-design-template-edit-style'
import { PanelPopover } from '../panel-popover'

export const PanelPopoverDesignTemplate = ({
	template,
}: {
	template: ITemplate
}) => {
	return (
		<PanelPopover name={DesignTypeEnum.FILL}>
			{/* style */}
			<SidebarPanelPopoverFormContainer>
				<Label htmlFor="style">Style</Label>
				<PanelFormDesignTemplateEditStyle template={template} />
			</SidebarPanelPopoverFormContainer>
		</PanelPopover>
	)
}
