import {
	Panel,
	PanelHeader,
	// PanelRow,
	// PanelRowContainer,
	PanelTitle,
} from '#app/components/shared'
import { type PickedArtboardType } from '../queries'
import { PanelFormArtboardDesignNewPalette } from './panel-form-artboard-design-new-palette'

export const PanelContentArtboardDesignPalette = ({
	artboard,
}: {
	artboard: PickedArtboardType
}) => {
	return (
		<Panel>
			<PanelHeader>
				<PanelTitle>Palette</PanelTitle>
				<div className="flex flex-shrink">
					<PanelFormArtboardDesignNewPalette artboardId={artboard.id} />
				</div>
			</PanelHeader>
		</Panel>
	)
}
