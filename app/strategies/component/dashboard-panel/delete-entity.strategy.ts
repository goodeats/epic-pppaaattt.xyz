import {
	type DeleteDesignSchemaType,
	DesignParentTypeIdEnum,
} from '#app/schema/design'
import { DeleteArtboardVersionDesignSchema } from '#app/schema/design-artboard-version'
import { DeleteLayerDesignSchema } from '#app/schema/design-layer'
import {
	type entityParentIdTypeEnum,
	type DeleteEntitySchemaType,
	type entityActionTypeEnum,
	EntityActionType,
	type entityTypeEnum,
	type entityParentTypeEnum,
	EntityType,
	EntityParentType,
} from '#app/schema/entity'
import { type DeleteLayerSchemaType } from '#app/schema/layer'
import { DeleteArtboardVersionLayerSchema } from '#app/schema/layer-artboard-version'
import { Routes, type RoutePath } from '#app/utils/routes.const'

export interface IDashboardPanelDeleteEntityStrategy {
	actionType: entityActionTypeEnum
	entityType: entityTypeEnum
	parentType: entityParentTypeEnum
	route: RoutePath
	parentTypeId: entityParentIdTypeEnum
	formId: string
	schema: DeleteEntitySchemaType
	iconText: string
}

export class DashboardPanelDeleteArtboardVersionDesignStrategy
	implements IDashboardPanelDeleteEntityStrategy
{
	actionType: entityActionTypeEnum = EntityActionType.DELETE
	entityType: entityTypeEnum = EntityType.DESIGN
	parentType: entityParentTypeEnum = EntityParentType.ARTBOARD_VERSION
	route: RoutePath = Routes.RESOURCES.API.V1.ARTBOARD_VERSION.DESIGN.DELETE
	parentTypeId: entityParentIdTypeEnum =
		DesignParentTypeIdEnum.ARTBOARD_VERSION_ID
	formId: string = 'artboard-version-design-delete'
	schema: DeleteDesignSchemaType = DeleteArtboardVersionDesignSchema
	iconText = 'Delete Design'
}

export class DashboardPanelDeleteArtboardVersionLayerStrategy
	implements IDashboardPanelDeleteEntityStrategy
{
	actionType: entityActionTypeEnum = EntityActionType.DELETE
	entityType: entityTypeEnum = EntityType.LAYER
	parentType: entityParentTypeEnum = EntityParentType.ARTBOARD_VERSION
	route: RoutePath = Routes.RESOURCES.API.V1.ARTBOARD_VERSION.LAYER.DELETE
	parentTypeId: entityParentIdTypeEnum =
		DesignParentTypeIdEnum.ARTBOARD_VERSION_ID
	formId: string = 'artboard-version-layer-delete'
	schema: DeleteLayerSchemaType = DeleteArtboardVersionLayerSchema
	iconText = 'Delete Layer'
}

export class DashboardPanelDeleteLayerDesignStrategy
	implements IDashboardPanelDeleteEntityStrategy
{
	actionType: entityActionTypeEnum = EntityActionType.DELETE
	entityType: entityTypeEnum = EntityType.DESIGN
	parentType: entityParentTypeEnum = EntityParentType.LAYER
	route: RoutePath = Routes.RESOURCES.API.V1.LAYER.DESIGN.DELETE
	parentTypeId: entityParentIdTypeEnum = DesignParentTypeIdEnum.LAYER_ID
	formId: string = 'layer-design-delete'
	schema: DeleteDesignSchemaType = DeleteLayerDesignSchema
	iconText = 'Delete Design'
}
