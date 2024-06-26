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

export class DashboardPanelUpdateArtworkVersionAssetTypeOrderStrategy
	implements IDashboardPanelUpdateEntityOrderStrategy
{
	entityType: entityTypeEnum = EntityType.ASSET
	parentType: entityParentTypeEnum = EntityParentType.ARTWORK_VERSION
}

export class DashboardPanelUpdateArtworkVersionDesignTypeOrderStrategy
	implements IDashboardPanelUpdateEntityOrderStrategy
{
	entityType: entityTypeEnum = EntityType.DESIGN
	parentType: entityParentTypeEnum = EntityParentType.ARTWORK_VERSION
}

export class DashboardPanelUpdateArtworkVersionLayerTypeOrderStrategy
	implements IDashboardPanelUpdateEntityOrderStrategy
{
	entityType: entityTypeEnum = EntityType.LAYER
	parentType: entityParentTypeEnum = EntityParentType.ARTWORK_VERSION
}

export class DashboardPanelUpdateLayerAssetTypeOrderStrategy
	implements IDashboardPanelUpdateEntityOrderStrategy
{
	entityType: entityTypeEnum = EntityType.ASSET
	parentType: entityParentTypeEnum = EntityParentType.LAYER
}

export class DashboardPanelUpdateLayerDesignTypeOrderStrategy
	implements IDashboardPanelUpdateEntityOrderStrategy
{
	entityType: entityTypeEnum = EntityType.DESIGN
	parentType: entityParentTypeEnum = EntityParentType.LAYER
}
