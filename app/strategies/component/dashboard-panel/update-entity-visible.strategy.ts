import {
	DesignParentTypeIdEnum,
	type ToggleVisibleDesignSchemaType,
} from '#app/schema/design'
import { ToggleVisibleArtboardVersionDesignSchema } from '#app/schema/design-artboard-version'
import {
	type ToggleVisibleEntitySchemaType,
	type entityParentIdTypeEnum,
} from '#app/schema/entity'
import { type ToggleVisibleLayerSchemaType } from '#app/schema/layer'
import { ToggleVisibleArtboardVersionLayerSchema } from '#app/schema/layer-artboard-version'
import { Routes, type RoutePath } from '#app/utils/routes.utils'

export interface IDashboardPanelUpdateEntityVisibleStrategy {
	route: RoutePath
	parentTypeId: entityParentIdTypeEnum
	formId: string
	schema: ToggleVisibleEntitySchemaType
	iconText: string
}

export class DashboardPanelUpdateArtboardVersionDesignTypeVisibleStrategy
	implements IDashboardPanelUpdateEntityVisibleStrategy
{
	route: RoutePath =
		Routes.RESOURCES.API.V1.ARTBOARD_VERSION.DESIGN.UPDATE.VISIBLE
	parentTypeId: entityParentIdTypeEnum =
		DesignParentTypeIdEnum.ARTBOARD_VERSION_ID
	formId: string = 'artboard-version-design-update-visible'
	schema: ToggleVisibleDesignSchemaType =
		ToggleVisibleArtboardVersionDesignSchema
	iconText = 'Design'
}

export class DashboardPanelUpdateArtboardVersionLayerTypeVisibleStrategy
	implements IDashboardPanelUpdateEntityVisibleStrategy
{
	route: RoutePath =
		Routes.RESOURCES.API.V1.ARTBOARD_VERSION.LAYER.UPDATE.VISIBLE
	parentTypeId: entityParentIdTypeEnum =
		DesignParentTypeIdEnum.ARTBOARD_VERSION_ID
	formId: string = 'artboard-version-layer-update-visible'
	schema: ToggleVisibleLayerSchemaType = ToggleVisibleArtboardVersionLayerSchema
	iconText = 'Design'
}
