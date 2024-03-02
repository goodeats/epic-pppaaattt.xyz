import {
	Panel,
	PanelRow,
	PanelRowContainer,
	PanelTitle,
} from '#app/components/shared'
import { type PickedArtboardType } from '../queries'
import { PanelFormArtboardBackgroundColor } from './panel-form-artboard-background-color'

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
					<PanelFormArtboardBackgroundColor artboard={artboard} />
				</PanelRowContainer>
			</PanelRow>
		</Panel>
	)
}
