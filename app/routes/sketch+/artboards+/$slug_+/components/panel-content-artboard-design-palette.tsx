import {
	Panel,
	PanelHeader,
	PanelRow,
	PanelRowContainer,
	PanelRowIconContainer,
	PanelRowValueContainer,
	// PanelRow,
	// PanelRowContainer,
	PanelTitle,
} from '#app/components/shared'
import { type IDesignWithPalette } from '#app/models/design.server'
import { type PickedArtboardType } from '../queries'
import { PanelFormArtboardDesignDelete } from './panel-form-artboard-design-delete'
import { PanelFormArtboardDesignEditPalette } from './panel-form-artboard-design-edit-palette'
import { PanelFormArtboardDesignNewPalette } from './panel-form-artboard-design-new-palette'

export const PanelContentArtboardDesignPalette = ({
	artboard,
	designPalettes,
}: {
	artboard: PickedArtboardType
	designPalettes: IDesignWithPalette[]
}) => {
	return (
		<Panel>
			<PanelHeader>
				<PanelTitle>Palette</PanelTitle>
				<div className="flex flex-shrink">
					<PanelFormArtboardDesignNewPalette artboardId={artboard.id} />
				</div>
			</PanelHeader>
			{designPalettes.map(designPalette => {
				const { id, palette } = designPalette
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
							<PanelRowIconContainer>
								{/* <ToggleAppearanceVisibilityPanelForm
									artboardId={artboard.id}
									appearanceId={appearance.id}
									isVisible={isVisible}
									tooltipContent={isVisible ? 'Hide' : 'Show'}
								/> */}
								<PanelFormArtboardDesignDelete
									id={id}
									artboardId={artboard.id}
								/>
							</PanelRowIconContainer>
						</PanelRowContainer>
					</PanelRow>
				)
			})}
		</Panel>
	)
}
