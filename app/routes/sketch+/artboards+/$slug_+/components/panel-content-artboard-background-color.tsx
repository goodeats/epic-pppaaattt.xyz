import {
	Panel,
	PanelRow,
	PanelRowContainer,
	PanelTitle,
} from '#app/components/shared'
import { type PickedArtboardType } from '../queries'
import { PanelFormArtboardEditBackgroundColor } from './panel-form-artboard-background-color'

export const PanelContentArtboardBackgroundColor = ({
	artboard,
}: {
	artboard: PickedArtboardType
}) => {
	return (
		<Panel>
			<PanelTitle>Background Color</PanelTitle>
			<PanelRow>
				<PanelRowContainer>
					<PanelFormArtboardEditBackgroundColor artboard={artboard} />
				</PanelRowContainer>
			</PanelRow>
		</Panel>
	)
}
