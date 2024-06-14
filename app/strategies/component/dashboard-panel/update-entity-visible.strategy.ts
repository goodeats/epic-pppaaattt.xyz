import {
	type entityActionTypeEnum,
	EntityActionType,
	type entityTypeEnum,
	type entityParentTypeEnum,
	EntityType,
	EntityParentType,
} from '#app/schema/entity'

export interface IDashboardPanelUpdateEntityVisibleStrategy {
	actionType: entityActionTypeEnum
	entityType: entityTypeEnum
	parentType: entityParentTypeEnum
}

export class DashboardPanelUpdateArtworkVersionAssetVisibleStrategy
	implements IDashboardPanelUpdateEntityVisibleStrategy
{
	actionType: entityActionTypeEnum = EntityActionType.TOGGLE_VISIBLE
	entityType: entityTypeEnum = EntityType.ASSET
	parentType: entityParentTypeEnum = EntityParentType.ARTWORK_VERSION
}

export class DashboardPanelUpdateArtworkVersionDesignVisibleStrategy
	implements IDashboardPanelUpdateEntityVisibleStrategy
{
	actionType: entityActionTypeEnum = EntityActionType.TOGGLE_VISIBLE
	entityType: entityTypeEnum = EntityType.DESIGN
	parentType: entityParentTypeEnum = EntityParentType.ARTWORK_VERSION
}

export class DashboardPanelUpdateArtworkVersionLayerVisibleStrategy
	implements IDashboardPanelUpdateEntityVisibleStrategy
{
	actionType: entityActionTypeEnum = EntityActionType.TOGGLE_VISIBLE
	entityType: entityTypeEnum = EntityType.LAYER
	parentType: entityParentTypeEnum = EntityParentType.ARTWORK_VERSION
}

export class DashboardPanelUpdateLayerDesignVisibleStrategy
	implements IDashboardPanelUpdateEntityVisibleStrategy
{
	actionType: entityActionTypeEnum = EntityActionType.TOGGLE_VISIBLE
	entityType: entityTypeEnum = EntityType.DESIGN
	parentType: entityParentTypeEnum = EntityParentType.LAYER
}
