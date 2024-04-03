import { SidebarPanelRowValuesContainer } from '#app/components/templates'
import { type ISize } from '#app/models/size.server'
import { PanelFormDesignSizeEditValue } from '../../../forms/design/panel-form-design-size-edit-value'
import { PanelPopoverDesignSize } from '../../../popovers/design/panel-popover-design-size'

export const PanelDesignTypeRowValuesSize = ({ size }: { size: ISize }) => {
	return (
		<SidebarPanelRowValuesContainer>
			<PanelPopoverDesignSize size={size} />
			<PanelFormDesignSizeEditValue size={size} />
		</SidebarPanelRowValuesContainer>
	)
}
