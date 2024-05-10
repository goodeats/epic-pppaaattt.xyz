import {
	SidebarPanelRowValuesContainer,
	SidebarPanelRowValuesDisabled,
} from '#app/components/templates'
import { type IStroke } from '#app/models/design-type/stroke/stroke.server'
import { PanelFormDesignStrokeEditValue } from '../../../forms/design/panel-form-design-stroke-edit-value'
import { PanelPopoverDesignStroke } from '../../../popovers/design/panel-popover-design-stroke'

export const PanelDesignTypeRowValuesStroke = ({
	stroke,
}: {
	stroke: IStroke
}) => {
	return (
		<SidebarPanelRowValuesContainer>
			<PanelPopoverDesignStroke stroke={stroke} />
			{/* this is a little buggy, but I can manage for now */}
			{stroke.basis !== 'defined' ? (
				<SidebarPanelRowValuesDisabled value={stroke.basis} />
			) : (
				<PanelFormDesignStrokeEditValue stroke={stroke} />
			)}
		</SidebarPanelRowValuesContainer>
	)
}
