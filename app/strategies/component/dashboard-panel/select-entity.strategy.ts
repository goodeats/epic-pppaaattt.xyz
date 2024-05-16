import { DesignParentTypeIdEnum } from '#app/schema/design'
import {
	type entityParentIdTypeEnum,
	type entityActionTypeEnum,
	EntityActionType,
	type SelectEntitySchemaType,
	type entityTypeEnum,
	type entityParentTypeEnum,
	EntityType,
	EntityParentType,
} from '#app/schema/entity'
import { type SelectLayerSchemaType } from '#app/schema/layer'
import { SelectArtboardVersionLayerSchema } from '#app/schema/layer-artboard-version'
import { Routes, type RoutePath } from '#app/utils/routes.const'

export interface IDashboardPanelSelectEntityStrategy {
	actionType: entityActionTypeEnum
	entityType: entityTypeEnum
	parentType: entityParentTypeEnum
	route: RoutePath
	parentTypeId: entityParentIdTypeEnum
	formId: string
	schema: SelectEntitySchemaType
	iconText: string
}

export class DashboardPanelSelectArtboardVersionLayerStrategy
	implements IDashboardPanelSelectEntityStrategy
{
	actionType: entityActionTypeEnum = EntityActionType.SELECT
	entityType: entityTypeEnum = EntityType.LAYER
	parentType: entityParentTypeEnum = EntityParentType.ARTBOARD_VERSION
	route: RoutePath =
		Routes.RESOURCES.API.V1.ARTBOARD_VERSION.LAYER.UPDATE.SELECTED
	parentTypeId: entityParentIdTypeEnum =
		DesignParentTypeIdEnum.ARTBOARD_VERSION_ID
	formId: string = 'artboard-version-layer-select'
	schema: SelectLayerSchemaType = SelectArtboardVersionLayerSchema
	iconText = 'Select Layer'
}
