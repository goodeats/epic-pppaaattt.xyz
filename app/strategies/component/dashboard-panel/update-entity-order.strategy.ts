import {
	type entityTypeEnum,
	type entityParentTypeEnum,
	EntityType,
	EntityParentType,
} from '#app/schema/entity'

export interface IDashboardPanelUpdateEntityOrderStrategy {
	entityType: entityTypeEnum
	parentType: entityParentTypeEnum
}

export class DashboardPanelUpdateArtboardVersionDesignTypeOrderStrategy
	implements IDashboardPanelUpdateEntityOrderStrategy
{
	entityType: entityTypeEnum = EntityType.DESIGN
	parentType: entityParentTypeEnum = EntityParentType.ARTBOARD_VERSION
}

export class DashboardPanelUpdateArtboardVersionLayerTypeOrderStrategy
	implements IDashboardPanelUpdateEntityOrderStrategy
{
	entityType: entityTypeEnum = EntityType.LAYER
	parentType: entityParentTypeEnum = EntityParentType.ARTBOARD_VERSION
}

export class DashboardPanelUpdateLayerDesignTypeOrderStrategy
	implements IDashboardPanelUpdateEntityOrderStrategy
{
	entityType: entityTypeEnum = EntityType.DESIGN
	parentType: entityParentTypeEnum = EntityParentType.LAYER
}
