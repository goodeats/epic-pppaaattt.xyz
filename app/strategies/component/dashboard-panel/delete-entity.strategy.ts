import {
	type entityActionTypeEnum,
	EntityActionType,
	type entityTypeEnum,
	type entityParentTypeEnum,
	EntityType,
	EntityParentType,
} from '#app/schema/entity'
export interface IDashboardPanelDeleteEntityStrategy {
	actionType: entityActionTypeEnum
	entityType: entityTypeEnum
	parentType: entityParentTypeEnum
}

export class DashboardPanelDeleteArtworkVersionAssetStrategy
	implements IDashboardPanelDeleteEntityStrategy
{
	actionType: entityActionTypeEnum = EntityActionType.DELETE
	entityType: entityTypeEnum = EntityType.ASSET
	parentType: entityParentTypeEnum = EntityParentType.ARTWORK_VERSION
}

export class DashboardPanelDeleteArtworkVersionDesignStrategy
	implements IDashboardPanelDeleteEntityStrategy
{
	actionType: entityActionTypeEnum = EntityActionType.DELETE
	entityType: entityTypeEnum = EntityType.DESIGN
	parentType: entityParentTypeEnum = EntityParentType.ARTWORK_VERSION
}

export class DashboardPanelDeleteArtworkVersionLayerStrategy
	implements IDashboardPanelDeleteEntityStrategy
{
	actionType: entityActionTypeEnum = EntityActionType.DELETE
	entityType: entityTypeEnum = EntityType.LAYER
	parentType: entityParentTypeEnum = EntityParentType.ARTWORK_VERSION
}

export class DashboardPanelDeleteLayerDesignStrategy
	implements IDashboardPanelDeleteEntityStrategy
{
	actionType: entityActionTypeEnum = EntityActionType.DELETE
	entityType: entityTypeEnum = EntityType.DESIGN
	parentType: entityParentTypeEnum = EntityParentType.LAYER
}
