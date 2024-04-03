import { SidebarPanelRowValuesContainer } from '#app/components/templates'
import { type IPalette } from '#app/models/palette.server'
import { PanelFormDesignPaletteEditValue } from '../../../forms/design/panel-form-design-palette-edit-value'
import { PanelPopoverDesignPalette } from '../../../popovers/design/panel-popover-design-palette'

export const PanelDesignTypeRowValuesPalette = ({
	palette,
}: {
	palette: IPalette
}) => {
	return (
		<SidebarPanelRowValuesContainer>
			<PanelPopoverDesignPalette palette={palette} />
			<PanelFormDesignPaletteEditValue palette={palette} />
		</SidebarPanelRowValuesContainer>
	)
}
