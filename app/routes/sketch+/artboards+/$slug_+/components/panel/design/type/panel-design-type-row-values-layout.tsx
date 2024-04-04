import {
	SidebarPanelRowValuesContainer,
	SidebarPanelRowValuesDisabled,
} from '#app/components/templates'
import { type ILayout } from '#app/models/layout.server'
import { PanelFormDesignLayoutEditCount } from '../../../forms/design/panel-form-design-layout-edit-count'
import { PanelPopoverDesignLayout } from '../../../popovers/design/panel-popover-design-layout'

export const PanelDesignTypeRowValuesLayout = ({
	layout,
}: {
	layout: ILayout
}) => {
	return (
		<SidebarPanelRowValuesContainer>
			<PanelPopoverDesignLayout layout={layout} />
			{layout.style === 'random' ? (
				<PanelFormDesignLayoutEditCount layout={layout} />
			) : (
				<SidebarPanelRowValuesDisabled
					value={`${layout.rows} x ${layout.columns}`}
				/>
			)}
		</SidebarPanelRowValuesContainer>
	)
}
