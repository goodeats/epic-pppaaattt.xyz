import {
	Panel,
	PanelRow,
	PanelRowContainer,
	PanelTitle,
} from '#app/components/shared'
import { type PickedArtboardType } from '../../../queries'
import { PanelFormArtboardEditHeight } from '../../forms/artboard/panel-form-artboard-edit-height'
import { PanelFormArtboardEditWidth } from '../../forms/artboard/panel-form-artboard-edit-width'

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
					<PanelFormArtboardEditWidth artboard={artboard} />
					<PanelFormArtboardEditHeight artboard={artboard} />
				</PanelRowContainer>
			</PanelRow>
		</Panel>
	)
}
