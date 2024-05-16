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

export class DashboardPanelDeleteArtboardVersionDesignStrategy
	implements IDashboardPanelDeleteEntityStrategy
{
	actionType: entityActionTypeEnum = EntityActionType.DELETE
	entityType: entityTypeEnum = EntityType.DESIGN
	parentType: entityParentTypeEnum = EntityParentType.ARTBOARD_VERSION
}

export class DashboardPanelDeleteArtboardVersionLayerStrategy
	implements IDashboardPanelDeleteEntityStrategy
{
	actionType: entityActionTypeEnum = EntityActionType.DELETE
	entityType: entityTypeEnum = EntityType.LAYER
	parentType: entityParentTypeEnum = EntityParentType.ARTBOARD_VERSION
}

export class DashboardPanelDeleteLayerDesignStrategy
	implements IDashboardPanelDeleteEntityStrategy
{
	actionType: entityActionTypeEnum = EntityActionType.DELETE
	entityType: entityTypeEnum = EntityType.DESIGN
	parentType: entityParentTypeEnum = EntityParentType.LAYER
}
