import {
	DashboardPanelDeleteArtboardVersionDesignStrategy,
	type IDashboardPanelDeleteEntityStrategy,
} from '../delete-entity.strategy'
import {
	DashboardPanelUpdateArtboardVersionDesignVisibleStrategy,
	DashboardPanelUpdateArtboardVersionLayerVisibleStrategy,
	type IDashboardPanelUpdateEntityVisibleStrategy,
} from '../update-entity-visible.strategy'

export type IPanelEntityActionStrategy =
	| IDashboardPanelUpdateEntityVisibleStrategy
	| IDashboardPanelDeleteEntityStrategy

export interface IDashboardPanelEntityActionStrategy {
	getPanelActions(): IPanelEntityActionStrategy[]
}

// artboard design
export class DashboardPanelArtboardVersionDesignActionStrategy
	implements IDashboardPanelEntityActionStrategy
{
	getPanelActions(): IPanelEntityActionStrategy[] {
		const strategyToggleVisible =
			new DashboardPanelUpdateArtboardVersionDesignVisibleStrategy()
		const strategyEntityDelete =
			new DashboardPanelDeleteArtboardVersionDesignStrategy()

		return [strategyToggleVisible, strategyEntityDelete]
	}
}

// artboard layer
export class DashboardPanelArtboardVersionLayerActionStrategy
	implements IDashboardPanelEntityActionStrategy
{
	getPanelActions(): IPanelEntityActionStrategy[] {
		const strategyToggleVisible =
			new DashboardPanelUpdateArtboardVersionLayerVisibleStrategy()

		return [strategyToggleVisible]
	}
}
