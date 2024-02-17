import { type Artboard } from '@prisma/client'
import {
	Panel,
	PanelHeader,
	PanelRow,
	PanelRowContainer,
	PanelRowIconContainer,
	PanelRowOrderContainer,
	PanelRowValueContainer,
	PanelTitle,
} from '#app/components/shared'
import { type AppearanceType } from '#app/utils/appearances'
import {
	type IAppearance,
	type IAppearancesOnArtboard,
} from '#app/utils/db.server'
import { EditAppearanceOrderPanelForm } from './__property-panel-arrange-form'
import { DeleteAppearancePanelForm } from './__property-panel-delete-form'
import { EditAppearanceValuePanelForm } from './__property-panel-edit-value'
import { PanelRowIndicator } from './__property-panel-indicator'
import { NewAppearancePanelForm } from './__property-panel-new-form'
import { ToggleAppearanceVisibilityPanelForm } from './__property-panel-toggle-visibility-form'

type PropertyPanelProps = {
	title: string
	artboard: Pick<Artboard, 'id' | 'name'>
	artboardAppearanceTypes: Array<
		Pick<
			IAppearancesOnArtboard,
			'id' | 'order' | 'isVisible' | 'artboardId'
		> & {
			appearance: Pick<
				IAppearance,
				'id' | 'name' | 'description' | 'slug' | 'value'
			>
		}
	>
	appearanceType: AppearanceType
}

// Figma calls these property panels
export const PropertyPanel = ({
	title,
	artboard,
	artboardAppearanceTypes,
	appearanceType,
}: PropertyPanelProps) => {
	const panelCount = artboardAppearanceTypes.length
	return (
		<Panel>
			<PanelHeader>
				<PanelTitle>{title}</PanelTitle>
				<div className="flex flex-shrink">
					<NewAppearancePanelForm
						artboardId={artboard.id}
						appearanceType={appearanceType}
						tooltipContent={`Add New ${title}`}
					/>
				</div>
			</PanelHeader>
			{artboardAppearanceTypes.map((artboardAppearance, index) => {
				const { isVisible, appearance } = artboardAppearance
				return (
					<PanelRow key={appearance.id}>
						<PanelRowOrderContainer>
							<EditAppearanceOrderPanelForm
								artboardId={artboard.id}
								appearanceId={appearance.id}
								appearanceType={appearanceType}
								panelCount={panelCount}
								panelIndex={index}
								direction="up"
								tooltipContent="Move Up"
							/>
							<EditAppearanceOrderPanelForm
								artboardId={artboard.id}
								appearanceId={appearance.id}
								appearanceType={appearanceType}
								panelCount={panelCount}
								panelIndex={index}
								direction="down"
								tooltipContent="Move down"
							/>
						</PanelRowOrderContainer>
						<PanelRowContainer>
							<PanelRowValueContainer>
								<PanelRowIndicator
									appearance={appearance}
									appearanceType={appearanceType}
								/>
								<EditAppearanceValuePanelForm
									appearance={appearance}
									appearanceType={appearanceType}
									tooltipContent="Edit Value"
								/>
							</PanelRowValueContainer>
							<PanelRowIconContainer>
								<ToggleAppearanceVisibilityPanelForm
									artboardId={artboard.id}
									appearanceId={appearance.id}
									isVisible={isVisible}
									tooltipContent={isVisible ? 'Hide' : 'Show'}
								/>
								<DeleteAppearancePanelForm
									artboardId={artboard.id}
									appearanceId={appearance.id}
									tooltipContent="Delete"
								/>
							</PanelRowIconContainer>
						</PanelRowContainer>
					</PanelRow>
				)
			})}
		</Panel>
	)
}
