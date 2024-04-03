import {
	SidebarPanelRowValuesContainer,
	SidebarPanelRowValuesDisabled,
} from '#app/components/templates'
import { type IFill } from '#app/models/fill.server'
import { PanelFormDesignFillEditValue } from '../../../forms/design/panel-form-design-fill-edit-value'
import { PanelPopoverDesignFill } from '../../../popovers/design/panel-popover-design-fill'

export const PanelDesignTypeRowValuesFill = ({ fill }: { fill: IFill }) => {
	return (
		<SidebarPanelRowValuesContainer>
			<PanelPopoverDesignFill fill={fill} />
			{/* this is a little buggy, but I can manage for now */}
			{fill.style === 'none' ? (
				<SidebarPanelRowValuesDisabled value="No Fill" />
			) : fill.basis !== 'defined' ? (
				<SidebarPanelRowValuesDisabled value={fill.basis} />
			) : (
				<PanelFormDesignFillEditValue fill={fill} />
			)}
		</SidebarPanelRowValuesContainer>
	)
}
