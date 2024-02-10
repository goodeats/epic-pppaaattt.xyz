import { type Artboard } from '@prisma/client'
import { Panel, PanelHeader, PanelTitle } from '#app/components/shared'
import { type AppearanceType } from '#app/utils/appearances'
import {
	type IAppearance,
	type IAppearancesOnArtboard,
} from '#app/utils/db.server'
import { NewAppearancePanelForm } from './__property-panel-add-new'

type PaletteListProps = {
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

export const PropertyPanel = ({
	title,
	artboard,
	artboardAppearanceTypes,
	appearanceType,
}: PaletteListProps) => {
	console.log('artboardAppearanceTypes', artboardAppearanceTypes)
	return (
		<Panel>
			<PanelHeader>
				<PanelTitle>{title}</PanelTitle>
				<div className="flex flex-shrink">
					<NewAppearancePanelForm
						artboardId={artboard.id}
						appearanceType={appearanceType}
					/>
				</div>
			</PanelHeader>
		</Panel>
	)
}
