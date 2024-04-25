import { DashboardEntityPanel } from '#app/components/templates/panel/dashboard-entity-panel'
import { type IArtboardVersionWithDesignsAndLayers } from '#app/models/artboard-version/artboard-version.server'
import { DesignParentTypeIdEnum } from '#app/schema/design'
import { DashboardPanelCreateArtboardVersionDesignTypeStrategy } from '#app/strategies/component/dashboard-panel/create-entity.strategy'
import { DashboardPanelArtboardVersionDesignActionStrategy } from '#app/strategies/component/dashboard-panel/entity-action/entity-action'
import { DashboardPanelUpdateArtboardVersionDesignTypeOrderStrategy } from '#app/strategies/component/dashboard-panel/update-entity-move.strategy'
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

	const strategyEntityNew =
		new DashboardPanelCreateArtboardVersionDesignTypeStrategy()
	const strategyReorder =
		new DashboardPanelUpdateArtboardVersionDesignTypeOrderStrategy()
	const strategyActions =
		new DashboardPanelArtboardVersionDesignActionStrategy()

	return (
		<div>
			{designTypePanels.map((designPanel, index) => {
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
						strategyActions={strategyActions}
					/>
				)
			})}
		</div>
	)
}
