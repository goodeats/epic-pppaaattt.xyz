import {
	type entityTypeEnum,
	EntityType,
	type entityParentTypeEnum,
	EntityParentType,
} from '#app/schema/entity'

export interface IDashboardPanelCreateEntityStrategy {
	entityType: entityTypeEnum
	parentType: entityParentTypeEnum
}

export class DashboardPanelCreateArtworkVersionDesignTypeStrategy
	implements IDashboardPanelCreateEntityStrategy
{
	entityType: entityTypeEnum = EntityType.DESIGN
	parentType: entityParentTypeEnum = EntityParentType.ARTWORK_VERSION
}

export class DashboardPanelCreateArtworkVersionLayerStrategy
	implements IDashboardPanelCreateEntityStrategy
{
	entityType: entityTypeEnum = EntityType.LAYER
	parentType: entityParentTypeEnum = EntityParentType.ARTWORK_VERSION
}

export class DashboardPanelCreateLayerDesignTypeStrategy
	implements IDashboardPanelCreateEntityStrategy
{
	entityType: entityTypeEnum = EntityType.DESIGN
	parentType: entityParentTypeEnum = EntityParentType.LAYER
}
