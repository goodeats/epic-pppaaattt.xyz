import {
	SidebarPanelRowValuesContainer,
	SidebarPanelRowValuesDisabled,
} from '#app/components/templates'
import { type ITemplate } from '#app/models/template.server'
import { PanelPopoverDesignTemplate } from '../../../popovers/design/panel-popover-design-template'

export const PanelDesignTypeRowValuesTemplate = ({
	template,
}: {
	template: ITemplate
}) => {
	return (
		<SidebarPanelRowValuesContainer>
			<PanelPopoverDesignTemplate template={template} />
			<SidebarPanelRowValuesDisabled value={template.style} />
		</SidebarPanelRowValuesContainer>
	)
}
