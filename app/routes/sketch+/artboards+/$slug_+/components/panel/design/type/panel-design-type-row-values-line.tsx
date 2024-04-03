import { SidebarPanelRowValuesContainer } from '#app/components/templates'
import { type ILine } from '#app/models/line.server'
import { PanelFormDesignLineEditWidth } from '../../../forms/design/panel-form-design-line=edit-width'
import { PanelPopoverDesignLine } from '../../../popovers/design/panel-popover-design-line'

export const PanelDesignTypeRowValuesLine = ({ line }: { line: ILine }) => {
	return (
		<SidebarPanelRowValuesContainer>
			<PanelPopoverDesignLine line={line} />
			<PanelFormDesignLineEditWidth line={line} />
		</SidebarPanelRowValuesContainer>
	)
}
