import {
	DesignParentTypeIdEnum,
	type designParentTypeIdEnum,
	type ToggleVisibleDesignSchemaType,
} from '#app/schema/design'
import { ToggleVisibleArtboardVersionDesignSchema } from '#app/schema/design-artboard-version'
import { Routes, type RoutePath } from '#app/utils/routes.utils'

export interface IDashboardPanelUpdateEntityValuesStrategy {
	route: RoutePath
	parentTypeId: designParentTypeIdEnum
	formId: string
	schema: ToggleVisibleDesignSchemaType // could also be layer
	iconText: string
}

export class DashboardPanelUpdateArtboardVersionDesignTypeVisibleStrategy
	implements IDashboardPanelUpdateEntityValuesStrategy
{
	route: RoutePath =
		Routes.RESOURCES.API.V1.ARTBOARD_VERSION.DESIGN.UPDATE.VISIBLE
	parentTypeId: designParentTypeIdEnum =
		DesignParentTypeIdEnum.ARTBOARD_VERSION_ID
	formId: string = 'artboard-version-design-update-visible'
	schema: ToggleVisibleDesignSchemaType =
		ToggleVisibleArtboardVersionDesignSchema
	iconText = 'Design'
}
