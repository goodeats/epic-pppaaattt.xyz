import { type Artboard } from '@prisma/client'
import {
	Panel,
	PanelHeader,
	PanelRow,
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
import { NewAppearancePanelForm } from './__property-panel-add-new'

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
				const { appearance } = artboardAppearance
				const value = JSON.parse(
					appearance.value,
				) as AppearanceValuesMap[typeof appearanceType]

				return <PanelRow key={artboardAppearance.id}>{value.value}</PanelRow>
			})}
		</Panel>
	)
}
