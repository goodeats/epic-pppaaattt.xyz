import {
	DesignParentTypeIdEnum,
	type ReorderDesignSchemaType,
	type designParentTypeIdEnum,
} from '#app/schema/design'
import { ReorderArtboardVersionDesignSchema } from '#app/schema/design-artboard-version'
import { Routes, type RoutePath } from '#app/utils/routes.utils'

export interface IDashboardPanelUpdateEntityOrderStrategy {
	route: RoutePath
	parentTypeId: designParentTypeIdEnum
	formId: string
	schema: ReorderDesignSchemaType // could also be layer
	iconText: string
}

export class DashboardPanelUpdateArtboardVersionDesignTypeOrderStrategy
	implements IDashboardPanelUpdateEntityOrderStrategy
{
	route: RoutePath =
		Routes.RESOURCES.API.V1.ARTBOARD_VERSION.DESIGN.UPDATE.ORDER
	parentTypeId: designParentTypeIdEnum =
		DesignParentTypeIdEnum.ARTBOARD_VERSION_ID
	formId: string = 'artboard-version-design-update-order'
	schema: ReorderDesignSchemaType = ReorderArtboardVersionDesignSchema
	iconText = 'Move'
}
