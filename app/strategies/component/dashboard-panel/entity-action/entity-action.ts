import {
	DashboardPanelDeleteArtworkVersionAssetStrategy,
	DashboardPanelDeleteArtworkVersionDesignStrategy,
	DashboardPanelDeleteLayerDesignStrategy,
	type IDashboardPanelDeleteEntityStrategy,
} from '../delete-entity.strategy'
import { DashboardPanelSelectArtworkVersionLayerStrategy } from '../update-entity-selected.strategy'
import {
	DashboardPanelUpdateArtworkVersionAssetVisibleStrategy,
	DashboardPanelUpdateArtworkVersionDesignVisibleStrategy,
	DashboardPanelUpdateArtworkVersionLayerVisibleStrategy,
	DashboardPanelUpdateLayerDesignVisibleStrategy,
	type IDashboardPanelUpdateEntityVisibleStrategy,
} from '../update-entity-visible.strategy'

export type IPanelEntityActionStrategy =
	| IDashboardPanelUpdateEntityVisibleStrategy
	| IDashboardPanelDeleteEntityStrategy

export interface IDashboardPanelEntityActionStrategy {
	getPanelActions(): IPanelEntityActionStrategy[]
}

export class DashboardPanelArtworkVersionAssetActionStrategy
	implements IDashboardPanelEntityActionStrategy
{
	getPanelActions(): IPanelEntityActionStrategy[] {
		const strategyToggleVisible =
			new DashboardPanelUpdateArtworkVersionAssetVisibleStrategy()
		const strategyDelete = new DashboardPanelDeleteArtworkVersionAssetStrategy()

		return [strategyToggleVisible, strategyDelete]
	}
}

export class DashboardPanelArtworkVersionDesignActionStrategy
	implements IDashboardPanelEntityActionStrategy
{
	getPanelActions(): IPanelEntityActionStrategy[] {
		const strategyToggleVisible =
			new DashboardPanelUpdateArtworkVersionDesignVisibleStrategy()
		const strategyDelete =
			new DashboardPanelDeleteArtworkVersionDesignStrategy()

		return [strategyToggleVisible, strategyDelete]
	}
}

// artwork layer
export class DashboardPanelArtworkVersionLayerActionStrategy
	implements IDashboardPanelEntityActionStrategy
{
	getPanelActions(): IPanelEntityActionStrategy[] {
		const strategyToggleVisible =
			new DashboardPanelUpdateArtworkVersionLayerVisibleStrategy()

		const strategySelect = new DashboardPanelSelectArtworkVersionLayerStrategy()

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
