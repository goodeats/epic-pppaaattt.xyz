import { type Artboard } from '@prisma/client'
import {
	Panel,
	PanelHeader,
	PanelRow,
	PanelRowContainer,
	PanelRowIconContainer,
	PanelRowValueContainer,
	PanelTitle,
} from '#app/components/shared'
import {
	type AppearanceType,
	type AppearanceValuesMap,
} from '#app/utils/appearances'
import {
	type IAppearance,
	type IAppearancesOnArtboard,
} from '#app/utils/db.server'
import { DeleteAppearancePanelForm } from './__property-panel-delete-form'
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
			{artboardAppearanceTypes.map(artboardAppearance => {
				// console.log(artboardAppearance)
				const { isVisible, appearance } = artboardAppearance
				const value = JSON.parse(
					appearance.value,
				) as AppearanceValuesMap[typeof appearanceType]
				return (
					<PanelRow key={appearance.id}>
						<PanelRowContainer>
							<PanelRowValueContainer>{value.value}</PanelRowValueContainer>
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
