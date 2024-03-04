import {
	Panel,
	PanelHeader,
	PanelRow,
	PanelRowContainer,
	PanelRowValueContainer,
	// PanelRow,
	// PanelRowContainer,
	PanelTitle,
} from '#app/components/shared'
import { type IPalette } from '#app/models/design.server'
import { type PickedArtboardType } from '../queries'
import { PanelFormArtboardDesignEditPalette } from './panel-form-artboard-design-edit-palette'
import { PanelFormArtboardDesignNewPalette } from './panel-form-artboard-design-new-palette'

export const PanelContentArtboardDesignPalette = ({
	artboard,
	palettes,
}: {
	artboard: PickedArtboardType
	palettes: IPalette[]
}) => {
	return (
		<Panel>
			<PanelHeader>
				<PanelTitle>Palette</PanelTitle>
				<div className="flex flex-shrink">
					<PanelFormArtboardDesignNewPalette artboardId={artboard.id} />
				</div>
			</PanelHeader>
			{palettes.map(palette => {
				return (
					<PanelRow key={palette.id}>
						<PanelRowContainer>
							<PanelRowValueContainer>
								{/* <PanelRowIndicator
									appearance={appearance}
									appearanceType={appearanceType}
								/> */}
								<PanelFormArtboardDesignEditPalette
									artboardId={artboard.id}
									palette={palette}
								/>
							</PanelRowValueContainer>
						</PanelRowContainer>
					</PanelRow>
				)
			})}
		</Panel>
	)
}
