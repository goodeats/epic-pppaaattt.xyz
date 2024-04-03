import {
	SidebarPanelRowValuesContainer,
	SidebarPanelRowValuesDisabled,
} from '#app/components/templates'
import { type IRotate } from '#app/models/rotate.server'
import { PanelFormDesignRotateEditValue } from '../../../forms/design/panel-form-design-rotate-edit-value'
import { PanelPopoverDesignRotate } from '../../../popovers/design/panel-popover-design-rotate'

export const PanelDesignTypeRowValuesRotate = ({
	rotate,
}: {
	rotate: IRotate
}) => {
	return (
		<SidebarPanelRowValuesContainer>
			<PanelPopoverDesignRotate rotate={rotate} />
			{rotate.basis !== 'defined' ? (
				<SidebarPanelRowValuesDisabled value={rotate.basis} />
			) : (
				<PanelFormDesignRotateEditValue rotate={rotate} />
			)}
		</SidebarPanelRowValuesContainer>
	)
}
