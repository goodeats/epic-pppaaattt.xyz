import {
	type entityActionTypeEnum,
	EntityActionType,
	type entityTypeEnum,
	type entityParentTypeEnum,
	EntityType,
	EntityParentType,
} from '#app/schema/entity'

export interface IDashboardPanelSelectEntityStrategy {
	actionType: entityActionTypeEnum
	entityType: entityTypeEnum
	parentType: entityParentTypeEnum
}

export class DashboardPanelSelectArtworkVersionLayerStrategy
	implements IDashboardPanelSelectEntityStrategy
{
	actionType: entityActionTypeEnum = EntityActionType.SELECT
	entityType: entityTypeEnum = EntityType.LAYER
	parentType: entityParentTypeEnum = EntityParentType.ARTWORK_VERSION
}
