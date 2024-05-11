import {
	DesignParentTypeIdEnum,
	type ToggleVisibleDesignSchemaType,
} from '#app/schema/design'
import { ToggleVisibleArtboardVersionDesignSchema } from '#app/schema/design-artboard-version'
import { ToggleVisibleLayerDesignSchema } from '#app/schema/design-layer'
import {
	type entityActionTypeEnum,
	type ToggleVisibleEntitySchemaType,
	type entityParentIdTypeEnum,
	EntityActionType,
} from '#app/schema/entity'
import { type ToggleVisibleLayerSchemaType } from '#app/schema/layer'
import { ToggleVisibleArtboardVersionLayerSchema } from '#app/schema/layer-artboard-version'
import { Routes, type RoutePath } from '#app/utils/routes.const'

export interface IDashboardPanelUpdateEntityVisibleStrategy {
	actionType: entityActionTypeEnum
	route: RoutePath
	parentTypeId: entityParentIdTypeEnum
	formId: string
	schema: ToggleVisibleEntitySchemaType
	iconText: string
}

export class DashboardPanelUpdateArtboardVersionDesignVisibleStrategy
	implements IDashboardPanelUpdateEntityVisibleStrategy
{
	actionType: entityActionTypeEnum = EntityActionType.TOGGLE_VISIBLE
	route: RoutePath =
		Routes.RESOURCES.API.V1.ARTBOARD_VERSION.DESIGN.UPDATE.VISIBLE
	parentTypeId: entityParentIdTypeEnum =
		DesignParentTypeIdEnum.ARTBOARD_VERSION_ID
	formId: string = 'artboard-version-design-update-visible'
	schema: ToggleVisibleDesignSchemaType =
		ToggleVisibleArtboardVersionDesignSchema
	iconText = 'Design'
}

export class DashboardPanelUpdateArtboardVersionLayerVisibleStrategy
	implements IDashboardPanelUpdateEntityVisibleStrategy
{
	actionType: entityActionTypeEnum = EntityActionType.TOGGLE_VISIBLE
	route: RoutePath =
		Routes.RESOURCES.API.V1.ARTBOARD_VERSION.LAYER.UPDATE.VISIBLE
	parentTypeId: entityParentIdTypeEnum =
		DesignParentTypeIdEnum.ARTBOARD_VERSION_ID
	formId: string = 'artboard-version-layer-update-visible'
	schema: ToggleVisibleLayerSchemaType = ToggleVisibleArtboardVersionLayerSchema
	iconText = 'Design'
}

export class DashboardPanelUpdateLayerDesignVisibleStrategy
	implements IDashboardPanelUpdateEntityVisibleStrategy
{
	actionType: entityActionTypeEnum = EntityActionType.TOGGLE_VISIBLE
	route: RoutePath = Routes.RESOURCES.API.V1.LAYER.DESIGN.UPDATE.VISIBLE
	parentTypeId: entityParentIdTypeEnum = DesignParentTypeIdEnum.LAYER_ID
	formId: string = 'layer-design-update-visible'
	schema: ToggleVisibleDesignSchemaType = ToggleVisibleLayerDesignSchema
	iconText = 'Design'
}
