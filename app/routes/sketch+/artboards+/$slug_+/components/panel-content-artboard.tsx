import {
	Panel,
	PanelRow,
	PanelRowContainer,
	PanelTitle,
} from '#app/components/shared'
import { type PickedArtboardType } from '../queries'
import { PanelFormArtboardWidth } from './panel-form-artboard-width'

export const PanelContentArtboard = ({
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
					<PanelFormArtboardWidth artboard={artboard} />
				</PanelRowContainer>
			</PanelRow>
		</Panel>
	)
}
