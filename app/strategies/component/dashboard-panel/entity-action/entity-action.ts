import {
	DashboardPanelDeleteArtboardVersionDesignStrategy,
	DashboardPanelDeleteLayerDesignStrategy,
	type IDashboardPanelDeleteEntityStrategy,
} from '../delete-entity.strategy'
import { DashboardPanelSelectArtboardVersionLayerStrategy } from '../select-entity.strategy'
import {
	DashboardPanelUpdateArtboardVersionDesignVisibleStrategy,
	DashboardPanelUpdateArtboardVersionLayerVisibleStrategy,
	DashboardPanelUpdateLayerDesignVisibleStrategy,
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
		const strategyDelete =
			new DashboardPanelDeleteArtboardVersionDesignStrategy()

		return [strategyToggleVisible, strategyDelete]
	}
}

// artboard layer
export class DashboardPanelArtboardVersionLayerActionStrategy
	implements IDashboardPanelEntityActionStrategy
{
	getPanelActions(): IPanelEntityActionStrategy[] {
		const strategyToggleVisible =
			new DashboardPanelUpdateArtboardVersionLayerVisibleStrategy()

		const strategySelect =
			new DashboardPanelSelectArtboardVersionLayerStrategy()

		// delete in popover so it's less easy to click accidentally from left sidebar

		return [strategyToggleVisible, strategySelect]
	}
}

export class DashboardPanelLayerDesignActionStrategy
	implements IDashboardPanelEntityActionStrategy
{
	getPanelActions(): IPanelEntityActionStrategy[] {
		const strategyToggleVisible =
			new DashboardPanelUpdateLayerDesignVisibleStrategy()
		const strategyDelete = new DashboardPanelDeleteLayerDesignStrategy()

		return [strategyToggleVisible, strategyDelete]
	}
}
