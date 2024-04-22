import { DashboardEntityPanel } from '#app/components/templates/panel/dashboard-entity-panel'
import { type IArtboardVersionWithDesignsAndLayers } from '#app/models/artboard-version/artboard-version.server'
import { DesignParentTypeIdEnum } from '#app/schema/design'
import { DashboardPanelCreateArtboardVersionDesignTypeStrategy } from '#app/strategies/component/dashboard-panel/create-entity.strategy'
import { DashboardPanelDeleteArtboardVersionDesignTypeStrategy } from '#app/strategies/component/dashboard-panel/delete-entity.strategy'
import { DashboardPanelUpdateArtboardVersionDesignTypeOrderStrategy } from '#app/strategies/component/dashboard-panel/update-entity-move.strategy'
import { DashboardPanelUpdateArtboardVersionDesignTypeVisibleStrategy } from '#app/strategies/component/dashboard-panel/update-entity-visible.strategy'
import {
	designsByTypeToPanelArray,
	filterAndOrderDesignsByType,
} from '#app/utils/design'

export const PanelArtboardVersionDesigns = ({
	version,
}: {
	version: IArtboardVersionWithDesignsAndLayers
}) => {
	const orderedDesigns = filterAndOrderDesignsByType({
		designs: version.designs,
	})
	const designTypePanels = designsByTypeToPanelArray({
		designs: orderedDesigns,
	})
	// remove trim after testing actions work for one design type
	const designsTrimmed = designTypePanels.slice(0, 4)
	// const designsTrimmed = designTypePanels

	const strategyEntityNew =
		new DashboardPanelCreateArtboardVersionDesignTypeStrategy()
	const strategyReorder =
		new DashboardPanelUpdateArtboardVersionDesignTypeOrderStrategy()
	const strategyToggleVisible =
		new DashboardPanelUpdateArtboardVersionDesignTypeVisibleStrategy()
	const strategyEntityDelete =
		new DashboardPanelDeleteArtboardVersionDesignTypeStrategy()

	return (
		<div>
			{designsTrimmed.length > 0 &&
				designsTrimmed.map((designPanel, index) => {
					const { type, designs, strategyEntityValues } = designPanel
					return (
						<DashboardEntityPanel
							key={type}
							type={type}
							parentTypeId={DesignParentTypeIdEnum.ARTBOARD_VERSION_ID}
							parent={version}
							entities={designs}
							strategyEntityNew={strategyEntityNew}
							strategyReorder={strategyReorder}
							strategyEntityValues={strategyEntityValues}
							strategyToggleVisible={strategyToggleVisible}
							strategyEntityDelete={strategyEntityDelete}
						/>
					)
				})}
		</div>
	)
}
