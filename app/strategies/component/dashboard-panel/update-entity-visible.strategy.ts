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

export class DashboardPanelUpdateArtboardVersionDesignVisibleStrategy
	implements IDashboardPanelUpdateEntityVisibleStrategy
{
	actionType: entityActionTypeEnum = EntityActionType.TOGGLE_VISIBLE
	entityType: entityTypeEnum = EntityType.DESIGN
	parentType: entityParentTypeEnum = EntityParentType.ARTBOARD_VERSION
}

export class DashboardPanelUpdateArtboardVersionLayerVisibleStrategy
	implements IDashboardPanelUpdateEntityVisibleStrategy
{
	actionType: entityActionTypeEnum = EntityActionType.TOGGLE_VISIBLE
	entityType: entityTypeEnum = EntityType.LAYER
	parentType: entityParentTypeEnum = EntityParentType.ARTBOARD_VERSION
}

export class DashboardPanelUpdateLayerDesignVisibleStrategy
	implements IDashboardPanelUpdateEntityVisibleStrategy
{
	actionType: entityActionTypeEnum = EntityActionType.TOGGLE_VISIBLE
	entityType: entityTypeEnum = EntityType.DESIGN
	parentType: entityParentTypeEnum = EntityParentType.LAYER
}
