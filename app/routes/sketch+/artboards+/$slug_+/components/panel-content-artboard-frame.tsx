import {
	Panel,
	PanelRow,
	PanelRowContainer,
	PanelTitle,
} from '#app/components/shared'
import { type PickedArtboardType } from '../queries'
import { PanelFormArtboardHeight } from './panel-form-artboard-height'
import { PanelFormArtboardWidth } from './panel-form-artboard-width'

export const PanelContentArtboardFrame = ({
	artboard,
}: {
	artboard: PickedArtboardType
}) => {
	return (
		<Panel>
			<PanelTitle>Frame</PanelTitle>
			<PanelRow>
				<PanelRowContainer>
					{/* 2 cols */}
					<PanelFormArtboardWidth artboard={artboard} />
					<PanelFormArtboardHeight artboard={artboard} />
				</PanelRowContainer>
			</PanelRow>
		</Panel>
	)
}
