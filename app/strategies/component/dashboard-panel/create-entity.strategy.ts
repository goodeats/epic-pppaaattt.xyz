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

export class DashboardPanelCreateArtboardVersionDesignTypeStrategy
	implements IDashboardPanelCreateEntityStrategy
{
	entityType: entityTypeEnum = EntityType.DESIGN
	parentType: entityParentTypeEnum = EntityParentType.ARTBOARD_VERSION
}

export class DashboardPanelCreateArtboardVersionLayerStrategy
	implements IDashboardPanelCreateEntityStrategy
{
	entityType: entityTypeEnum = EntityType.LAYER
	parentType: entityParentTypeEnum = EntityParentType.ARTBOARD_VERSION
}

export class DashboardPanelCreateLayerDesignTypeStrategy
	implements IDashboardPanelCreateEntityStrategy
{
	entityType: entityTypeEnum = EntityType.DESIGN
	parentType: entityParentTypeEnum = EntityParentType.LAYER
}
